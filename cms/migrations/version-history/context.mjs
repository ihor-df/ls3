import {readFile, writeFile} from 'node:fs/promises'
import {parseEnv} from 'node:util'
import {fileURLToPath} from 'node:url'
import {resolve} from 'node:path'
import {createClient} from '@sanity/client'

export const migrationRoot = fileURLToPath(new URL('.', import.meta.url))
export const locales = ['en', 'ru', 'pt', 'es', 'fr', 'de', 'tr', 'uk', 'zh']
export const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
export const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`)

export async function context() {
  const cms = parseEnv(await readFile(new URL('../../.env.production', import.meta.url), 'utf8'))
  const local = parseEnv(await readFile(new URL('../../../landing/.env.local', import.meta.url), 'utf8'))
  const token = process.env.SANITY_PROD_TRANSLATION_TOKEN || local.SANITY_PROD_TRANSLATION_TOKEN
  if (!token || !local.STRAPI_PROD_TRANSLATION_TOKEN) throw new Error('Migration tokens are missing')
  if (cms.SANITY_STUDIO_DATASET !== 'production') throw new Error('Expected the production dataset')
  const client = createClient({
    projectId: cms.SANITY_STUDIO_PROJECT_ID,
    dataset: 'production',
    token,
    apiVersion: '2026-08-13',
    useCdn: false,
    perspective: 'raw',
  })
  return {
    client,
    projectId: cms.SANITY_STUDIO_PROJECT_ID,
    strapiOrigin: new URL(local.STRAPI_PROD_TRANSLATION_URL).origin,
    strapiToken: local.STRAPI_PROD_TRANSLATION_TOKEN,
  }
}

export function snapshotPath() {
  const index = process.argv.indexOf('--snapshot')
  if (index < 0 || !process.argv[index + 1]) throw new Error('Pass --snapshot <directory>')
  return resolve(process.argv[index + 1])
}

export async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {headers, signal: AbortSignal.timeout(30000)})
  if (!response.ok) throw new Error(`Read request failed: HTTP ${response.status} (${new URL(url).pathname})`)
  return response.json()
}
