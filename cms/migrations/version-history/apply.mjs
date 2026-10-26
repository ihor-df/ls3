import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {isDeepStrictEqual} from 'node:util'
import {ensureMediaFolder} from '../../lib/mediaFolders.ts'
import {context, readJson, snapshotPath, writeJson, runMigration} from './context.mjs'

await runMigration(async () => {
  assert(
    process.argv.includes('--apply-production'),
    'Pass --apply-production to write to production',
  )
  const directory = snapshotPath()
  const {client, projectId} = await context()
  const snapshot = await readJson(join(directory, 'snapshot.json'))
  assert.equal(snapshot.projectId, projectId)
  assert.equal(snapshot.dataset, 'production')
  const plan = await readJson(join(directory, 'plan.json'))
  const backup = await readJson(join(directory, 'sanity-before.json'))
  const currentVersions = await client.fetch('*[_type == "version"]')
  assert(
    !currentVersions.some((doc) => doc._id.startsWith('drafts.')),
    'A version draft appeared after extraction',
  )
  const expectedIds = new Set(
    plan.releases.flatMap((release) => release.documents.map((item) => item.document._id)),
  )
  assert(
    currentVersions.every((doc) => expectedIds.has(doc._id)),
    'Unexpected version documents appeared after extraction',
  )

  const hasFields = (current, expected) =>
    current &&
    Object.entries(expected).every(([key, value]) => isDeepStrictEqual(current[key], value))
  for (const doc of currentVersions) {
    const before = backup.find((item) => item._id === doc._id)
    if (before && doc._rev !== before._rev) {
      // A resumed run may already have imported this document; accept only an
      // exact match after substituting its real asset reference below.
      const expected = structuredClone(
        plan.releases
          .flatMap((release) => release.documents)
          .find((item) => item.document._id === doc._id).document,
      )
      expected.cover.asset = doc.cover.asset
      assert(hasFields(doc, expected), `Concurrent edit: ${doc._id}`)
    }
  }

  let importedAssets = {}
  try {
    importedAssets = await readJson(join(directory, 'assets-imported.json'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  for (const [index, release] of plan.releases.entries()) {
    const source = release.asset
    let asset =
      importedAssets[source.sourceId] &&
      (await client.getDocument(importedAssets[source.sourceId]._id))
    asset ||= await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $hash][0]', {
      hash: source.sha1,
    })
    if (!asset) {
      asset = await client.assets.upload(
        'image',
        await readFile(join(directory, 'assets', source.filename)),
        {
          filename: source.filename,
          contentType: 'image/jpeg',
          source: {name: 'strapi', id: `version-cover-${source.sourceId}`, url: source.url},
        },
      )
    }
    assert.equal(asset.sha1hash, source.sha1, `Uploaded image differs: ${release.version}`)
    importedAssets[source.sourceId] = {_id: asset._id, filename: source.filename}
    await writeJson(join(directory, 'assets-imported.json'), importedAssets)
    const folderId = await ensureMediaFolder(client, 'version-history')
    assert(
      !asset.opt?.media?.folder?._ref || asset.opt.media.folder._ref === folderId,
      `Cover already belongs to another folder: ${release.version}`,
    )
    if (asset.originalFilename !== source.filename || asset.opt?.media?.folder?._ref !== folderId) {
      await client
        .patch(asset._id)
        .ifRevisionId(asset._rev)
        .set({originalFilename: source.filename})
        .setIfMissing({opt: {}})
        .setIfMissing({'opt.media': {}})
        .setIfMissing({'opt.media.folder': {_type: 'reference', _ref: folderId, _weak: true}})
        .commit()
    }
    console.log(`Cover ${index + 1}/${plan.releases.length}: ${release.version}`)
  }

  const applied = []
  for (const [index, release] of plan.releases.entries()) {
    const items = [...release.documents, release.metadata].map((item) => structuredClone(item))
    for (const {document} of items) {
      if (document._type === 'version')
        document.cover.asset._ref = importedAssets[release.asset.sourceId]._id
    }
    const current = await client.getDocuments(items.map((item) => item.document._id))
    let transaction = client.transaction()
    let changes = 0
    for (const [itemIndex, {document, previousRev}] of items.entries()) {
      const existing = current[itemIndex]
      if (hasFields(existing, document)) continue
      if (existing) {
        assert(
          previousRev && existing._rev === previousRev,
          `Concurrent edit or ID collision: ${document._id}`,
        )
        const {_id, _type, ...fields} = document
        assert.equal(existing._type, _type)
        transaction = transaction.patch(_id, (patch) => patch.ifRevisionId(previousRev).set(fields))
      } else {
        assert(!previousRev, `Existing document was deleted: ${document._id}`)
        transaction = transaction.create(document)
      }
      changes++
    }
    // Nine published documents and their strong translation references are atomic.
    const result = changes ? await transaction.commit({visibility: 'sync'}) : null
    applied.push({
      version: release.version,
      documentIds: items.map((item) => item.document._id),
      transactionId: result?.transactionId ?? null,
    })
    await writeJson(join(directory, 'applied-releases.json'), applied)
    console.log(
      `Release ${index + 1}/${plan.releases.length}: ${release.version} (${changes} changes)`,
    )
  }
  console.log('Import complete. Run verify.mjs against this snapshot.')
})
