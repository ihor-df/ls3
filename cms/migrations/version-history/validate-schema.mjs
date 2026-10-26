import {execFile} from 'node:child_process'
import {writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {join} from 'node:path'
import {context, readJson, snapshotPath, runMigration} from './context.mjs'

await runMigration(async () => {
  const directory = snapshotPath()
  const {client, projectId} = await context()
  const [documents, plan] = await Promise.all([
    readJson(join(directory, 'sanity-after.json')),
    readJson(join(directory, 'plan.json')),
  ])
  const ids = new Set(
    plan.releases.flatMap((release) => [
      ...release.documents.map((item) => item.document._id),
      release.metadata.document._id,
    ]),
  )
  const file = join(directory, 'validate.ndjson')
  await writeFile(
    file,
    documents
      .filter((doc) => ids.has(doc._id))
      .map((doc) => JSON.stringify(doc))
      .join('\n') + '\n',
  )
  const result = await new Promise((resolve) => {
    execFile(
      process.execPath,
      [
        fileURLToPath(new URL('../../node_modules/sanity/bin/sanity', import.meta.url)),
        'documents',
        'validate',
        '--project-id',
        projectId,
        '--dataset',
        'production',
        '--file',
        file,
        '--format',
        'ndjson',
        '--level',
        'warning',
        '--yes',
        '--max-custom-validation-concurrency',
        '5',
        '--max-fetch-concurrency',
        '10',
      ],
      {
        cwd: fileURLToPath(new URL('../../', import.meta.url)),
        maxBuffer: 16 * 1024 * 1024,
        env: {
          ...process.env,
          SANITY_ACTIVE_ENV: 'production',
          SANITY_AUTH_TOKEN: client.config().token,
        },
      },
      (error, stdout, stderr) => resolve({error, stdout, stderr}),
    )
  })
  await writeFile(join(directory, 'schema-validation.ndjson'), result.stdout)
  await writeFile(join(directory, 'schema-validation.log'), result.stderr)
  if (result.error)
    throw new Error(`Schema validation failed. See schema-validation.log (${result.error.code})`)
  console.log(
    `Schema validation complete for ${ids.size} migrated documents. Report: ${join(directory, 'schema-validation.ndjson')}`,
  )
})
