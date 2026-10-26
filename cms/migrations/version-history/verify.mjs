import assert from 'node:assert/strict'
import {join} from 'node:path'
import {
  context,
  fetchJson,
  locales,
  readJson,
  snapshotPath,
  writeJson,
  runMigration,
} from './context.mjs'

await runMigration(async () => {
  const directory = snapshotPath()
  const {client, strapiOrigin, strapiToken} = await context()
  const [plan, importedAssets, backup, sourceRecords] = await Promise.all([
    readJson(join(directory, 'plan.json')),
    readJson(join(directory, 'assets-imported.json')),
    readJson(join(directory, 'sanity-before.json')),
    readJson(join(directory, 'strapi-records.json')),
  ])
  const documents = await client.fetch(
    '*[_type in ["version", "translation.metadata", "sanity.imageAsset", "media.folder"]] | order(_id asc)',
  )
  await writeJson(join(directory, 'sanity-after.json'), documents)
  const byId = new Map(documents.map((doc) => [doc._id, doc]))
  const versions = documents.filter((doc) => doc._type === 'version')
  assert.equal(versions.length, plan.summary.sourceRecords)
  const versionFolders = documents.filter(
    (doc) => doc._type === 'media.folder' && doc.name === 'version-history' && !doc.parent?._ref,
  )
  assert.equal(versionFolders.length, 1, 'Expected one shared version-history folder')
  const versionFolder = versionFolders[0]
  const counts = Object.fromEntries(
    locales.map((locale) => [locale, versions.filter((doc) => doc.language === locale).length]),
  )
  for (const release of plan.releases) {
    const asset = byId.get(importedAssets[release.asset.sourceId]._id)
    assert.equal(asset.originalFilename, release.asset.filename)
    assert.equal(asset.sha1hash, release.asset.sha1)
    assert.equal(asset.opt.media.folder._ref, versionFolder._id)
    for (const {document} of [...release.documents, release.metadata]) {
      const expected = structuredClone(document)
      if (expected._type === 'version') expected.cover.asset._ref = asset._id
      const actual = byId.get(expected._id)
      assert(actual, `Missing document: ${expected._id}`)
      for (const [key, value] of Object.entries(expected))
        assert.deepEqual(
          actual[key],
          value,
          `${release.version} ${actual.language ?? 'translations'} ${key}`,
        )
      if (actual._type === 'translation.metadata') {
        assert.equal(actual.translations.length, locales.length)
        for (const translation of actual.translations)
          assert.equal(byId.get(translation.value._ref)?.language, translation.language)
      }
    }
  }
  const published = await client.fetch(
    'count(*[_type == "version"])',
    {},
    {perspective: 'published'},
  )
  assert.equal(published, sourceRecords.length)
  // Authentication can read private dotted IDs that visitors cannot access.
  // Compare the complete public result, not only the authenticated perspective.
  const publicVersions = await client
    .withConfig({token: '', useCdn: false, perspective: 'published'})
    .fetch('*[_type == "version"] | order(_id asc)')
  assert.deepEqual(publicVersions, versions, 'Public and authenticated version documents differ')
  // Unrelated translation groups must not be changed by the migration.
  for (const doc of backup.filter(
    (item) => item._type === 'translation.metadata' && !item.schemaTypes?.includes('version'),
  )) {
    assert.equal(byId.get(doc._id)?._rev, doc._rev, `Unrelated metadata changed: ${doc._id}`)
  }

  let checkedUrls = 0
  const pending = plan.releases.map(
    (release) => byId.get(importedAssets[release.asset.sourceId]._id).url,
  )
  await Promise.all(
    Array.from({length: 4}, async () => {
      while (pending.length) {
        const response = await fetch(pending.shift(), {
          method: 'HEAD',
          signal: AbortSignal.timeout(20000),
        })
        assert(response.ok, `Image CDN returned HTTP ${response.status}`)
        checkedUrls++
      }
    }),
  )
  // Detect source edits or newly published records made during this run.
  for (const locale of locales) {
    const records = []
    for (let page = 1; ; page++) {
      const url = new URL('/api/versions', strapiOrigin)
      for (const [key, value] of Object.entries({
        locale,
        status: 'published',
        'pagination[pageSize]': '100',
        'pagination[page]': String(page),
        'fields[0]': 'documentId',
        'fields[1]': 'locale',
        'fields[2]': 'updatedAt',
      }))
        url.searchParams.set(key, value)
      const result = await fetchJson(url, {Authorization: `Bearer ${strapiToken}`})
      records.push(...result.data)
      if (page >= result.meta.pagination.pageCount) break
    }
    const expected = sourceRecords.filter((record) => record.locale === locale)
    assert.equal(records.length, expected.length, `Source count changed: ${locale}`)
    for (const record of records)
      assert.equal(
        record.updatedAt,
        expected.find((item) => item.documentId === record.documentId)?.updatedAt,
        `Source changed: ${record.documentId}:${locale}`,
      )
  }
  const report = {
    verifiedAt: new Date().toISOString(),
    dataset: 'production',
    publishedDocuments: published,
    publiclyAccessibleDocuments: publicVersions.length,
    releaseCount: plan.releases.length,
    localeCounts: counts,
    updatedDocuments: plan.summary.updateDocuments,
    createdDocuments: plan.summary.createDocuments,
    translationGroups: plan.releases.length,
    sharedCovers: plan.summary.covers,
    reusedCovers: plan.summary.reusableCovers,
    checkedImageUrls: checkedUrls,
    textAndFieldsMatch: true,
    allTranslationReferencesResolve: true,
    unrelatedMetadataUnchanged: true,
    sourceUnchangedDuringMigration: true,
  }
  await writeJson(join(directory, 'verification.json'), report)
  console.log(JSON.stringify(report, null, 2))
})
