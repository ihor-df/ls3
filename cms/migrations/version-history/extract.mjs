import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {createHash} from 'node:crypto'
import {context, fetchJson, locales, migrationRoot, writeJson} from './context.mjs'

const {client, projectId, strapiOrigin, strapiToken} = await context()
const directory = join(migrationRoot, 'data', new Date().toISOString().replaceAll(':', '-'))
await mkdir(join(directory, 'assets'), {recursive: true})

// Back up all potentially touched documents, including raw drafts and asset metadata.
const backup = await client.fetch(`*[_type in [
  "version", "translation.metadata", "sanity.imageAsset", "media.folder"
]] | order(_id asc)`)
await writeJson(join(directory, 'sanity-before.json'), backup)
console.log(`Backup saved: ${backup.length} documents (${backup.filter((doc) => doc._type === 'version').length} versions)`)

const records = []
for (const locale of locales) {
  const pages = []
  for (let page = 1; ; page++) {
    const url = new URL('/api/versions', strapiOrigin)
    for (const [key, value] of Object.entries({
      locale, status: 'published', 'pagination[pageSize]': '100',
      'pagination[page]': String(page), 'populate[cover]': 'true',
      'sort[0]': 'documentId:asc',
    })) url.searchParams.set(key, value)
    const result = await fetchJson(url, {Authorization: `Bearer ${strapiToken}`})
    if (!Array.isArray(result.data) || !result.meta?.pagination) throw new Error(`Unexpected Strapi response for ${locale}`)
    pages.push(result)
    records.push(...result.data)
    if (page >= result.meta.pagination.pageCount) break
  }
  await writeJson(join(directory, `strapi-${locale}.json`), pages)
  console.log(`Strapi ${locale}: ${pages.flatMap((page) => page.data).length} published entries`)
}
await writeJson(join(directory, 'strapi-records.json'), records)

const covers = new Map()
for (const record of records) {
  if (!record.publishedAt || !record.documentId || !locales.includes(record.locale)) throw new Error('Invalid published source record')
  if (!record.cover?.url || record.cover.mime !== 'image/jpeg') throw new Error(`Missing/non-JPEG cover: ${record.slug}`)
  const key = String(record.cover.id)
  if (!covers.has(key)) covers.set(key, {source: record.cover, version: record.slug, records: []})
  const cover = covers.get(key)
  if (cover.version !== record.slug) throw new Error('One source cover belongs to multiple releases')
  cover.records.push(`${record.locale}:${record.documentId}`)
}

const manifest = []
const pending = [...covers.values()]
await Promise.all(Array.from({length: 4}, async () => {
  while (pending.length) {
    const {source, version, records: refs} = pending.shift()
    const url = new URL(source.url, strapiOrigin).href
    const response = await fetch(url, {signal: AbortSignal.timeout(30000)})
    if (!response.ok) throw new Error(`Cover download failed for ${version}: HTTP ${response.status}`)
    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error(`Invalid JPEG for ${version}`)
    const filename = `version-history-${version}.jpg`
    await writeFile(join(directory, 'assets', filename), buffer)
    manifest.push({sourceId: source.id, version, filename, url, bytes: buffer.length,
      sha1: createHash('sha1').update(buffer).digest('hex'), refs})
  }
}))
manifest.sort((a, b) => a.version.localeCompare(b.version))
if (new Set(manifest.map((asset) => asset.sha1)).size !== manifest.length) {
  throw new Error('Identical cover files across different releases require a folder/naming decision')
}
await writeJson(join(directory, 'assets.json'), manifest)
await writeJson(join(directory, 'snapshot.json'), {
  extractedAt: new Date().toISOString(), projectId, dataset: 'production',
  locales, sourceRecords: records.length, releases: new Set(records.map((record) => record.documentId)).size,
  assets: manifest.length, backupDocuments: backup.length,
})
console.log(`Snapshot complete: ${directory}`)
