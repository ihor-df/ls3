import {getCliClient} from 'sanity/cli'

async function main() {
  const client = getCliClient({apiVersion: '2026-08-17'}).withConfig({
    perspective: 'raw',
  })

  const docs = await client.fetch<{_id: string}[]>(
    `*[_type == "article" && defined(previewDescription)]{_id}`,
  )

  if (!docs.length) {
    console.log('No article documents with previewDescription found')
    return
  }

  const transaction = client.transaction()

  for (const doc of docs) {
    transaction.patch(doc._id, (patch) => patch.unset(['previewDescription']))
  }

  await transaction.commit()

  console.log(`Removed previewDescription from ${docs.length} article documents`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
