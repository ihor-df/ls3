import {join} from 'node:path'
import {readJson, snapshotPath, writeJson, runMigration} from './context.mjs'
import {buildPlan} from './transform.mjs'

await runMigration(async () => {
  const directory = snapshotPath()
  const [records, backup, assets] = await Promise.all([
    readJson(join(directory, 'strapi-records.json')),
    readJson(join(directory, 'sanity-before.json')),
    readJson(join(directory, 'assets.json')),
  ])
  const plan = buildPlan(records, backup, assets)
  await writeJson(join(directory, 'plan.json'), plan)
  console.log(JSON.stringify(plan.summary, null, 2))
})
