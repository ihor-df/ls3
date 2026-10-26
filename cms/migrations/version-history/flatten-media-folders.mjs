import assert from 'node:assert/strict'
import {join} from 'node:path'
import {context, readJson, runMigration, snapshotPath, writeJson} from './context.mjs'

await runMigration(async () => {
  const directory = snapshotPath()
  const {client, projectId} = await context()
  const snapshot = await readJson(join(directory, 'snapshot.json'))
  assert.equal(snapshot.projectId, projectId)
  assert.equal(snapshot.dataset, 'production')
  const imported = await readJson(join(directory, 'assets-imported.json'))
  const importedIds = new Set(Object.values(imported).map((asset) => asset._id))
  const before = await client.fetch(
    '*[_type in ["media.folder", "sanity.imageAsset", "version"]] | order(_id asc)',
  )
  const folders = before.filter((doc) => doc._type === 'media.folder')
  const roots = folders.filter(
    (folder) => folder.name === 'version-history' && !folder.parent?._ref,
  )
  assert.equal(roots.length, 1, 'Expected one version-history root folder')
  const root = roots[0]
  const children = folders.filter((folder) => folder.parent?._ref === root._id)
  assert(
    children.every((folder) => /^v\d+\.\d+\.\d+$/.test(folder.name)),
    'Unexpected child folder',
  )
  const childIds = new Set(children.map((folder) => folder._id))
  assert(!folders.some((folder) => childIds.has(folder.parent?._ref)), 'Unexpected nested folders')
  const assets = before.filter((doc) => doc._type === 'sanity.imageAsset')
  const moving = assets.filter((asset) => childIds.has(asset.opt?.media?.folder?._ref))
  assert(
    moving.every((asset) => importedIds.has(asset._id)),
    'Unexpected assets in version folders',
  )
  for (const id of importedIds) {
    const asset = assets.find((doc) => doc._id === id)
    assert(asset, `Missing migrated cover: ${id}`)
    assert(
      asset.opt?.media?.folder?._ref === root._id || childIds.has(asset.opt?.media?.folder?._ref),
      `Cover moved to another folder: ${id}`,
    )
  }
  const references = childIds.size
    ? await client.fetch('*[references($ids)]{_id,_type}', {ids: [...childIds]})
    : []
  const movingIds = new Set(moving.map((asset) => asset._id))
  assert(
    references.every((doc) => movingIds.has(doc._id)),
    'Unrelated references to child folders',
  )
  const summary = {
    dataset: 'production',
    targetFolder: 'version-history',
    imagesToMove: moving.length,
    emptyFoldersToRemove: children.length,
    sharedCovers: importedIds.size,
  }
  console.log(JSON.stringify(summary, null, 2))
  if (!process.argv.includes('--apply-production')) {
    console.log('Dry run only. Pass --apply-production to apply this plan.')
    return
  }
  const backupName = `media-before-flatten-${new Date().toISOString().replaceAll(':', '-')}.json`
  await writeJson(join(directory, backupName), before)
  let transaction = client.transaction()
  for (const asset of moving) {
    transaction = transaction.patch(asset._id, (patch) =>
      patch.ifRevisionId(asset._rev).set({
        'opt.media.folder': {_type: 'reference', _ref: root._id, _weak: true},
      }),
    )
  }
  for (const folder of children) {
    transaction = transaction
      .patch(folder._id, (patch) => patch.ifRevisionId(folder._rev).set({name: folder.name}))
      .delete(folder._id)
  }
  const result =
    moving.length || children.length ? await transaction.commit({visibility: 'sync'}) : null
  const after = await client.fetch(
    '*[_type in ["media.folder", "sanity.imageAsset", "version"]] | order(_id asc)',
  )
  const byId = new Map(after.map((doc) => [doc._id, doc]))
  for (const previous of before) {
    if (childIds.has(previous._id)) {
      assert(!byId.has(previous._id), `Child folder still exists: ${previous.name}`)
      continue
    }
    const actual = byId.get(previous._id)
    if (!movingIds.has(previous._id)) {
      assert.deepEqual(actual, previous, `Unrelated document changed: ${previous._id}`)
      continue
    }
    const expected = structuredClone(previous)
    expected.opt.media.folder = {_type: 'reference', _ref: root._id, _weak: true}
    // Only revision and update time change along with the folder assignment.
    expected._rev = actual._rev
    expected._updatedAt = actual._updatedAt
    assert.deepEqual(actual, expected, `Unexpected asset change: ${previous._id}`)
  }
  assert.equal(after.length, before.length - children.length)
  for (const id of importedIds) assert.equal(byId.get(id).opt.media.folder._ref, root._id)
  const report = {
    ...summary,
    completedAt: new Date().toISOString(),
    transactionId: result?.transactionId ?? null,
    backup: backupName,
    assetIdsUrlsAndOtherMetadataUnchanged: true,
    versionDocumentsUnchanged: true,
    unrelatedDocumentsUnchanged: true,
  }
  await writeJson(join(directory, 'media-flatten-verification.json'), report)
  console.log(JSON.stringify(report, null, 2))
})
