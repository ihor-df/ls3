import assert from 'node:assert/strict'
import {test} from 'node:test'
import {
  assignImageToMediaFolder,
  ensureMediaFolder,
  getDocumentMediaFolder,
  getSelectedImageAssetId,
} from '../lib/mediaFolders.ts'

function createDataset(initial = []) {
  const documents = new Map(initial.map((doc) => [doc._id, structuredClone(doc)]))
  const writes = []
  const client = {
    async fetch(_query, {name, parentId}) {
      return (
        [...documents.values()].find(
          (doc) =>
            doc._type === 'media.folder' &&
            doc.name.toLowerCase() === name.toLowerCase() &&
            (doc.parent?._ref ?? null) === parentId,
        ) ?? null
      )
    },
    async createIfNotExists(doc) {
      if (!documents.has(doc._id)) {
        documents.set(doc._id, structuredClone(doc))
        writes.push(doc._id)
      }
      return documents.get(doc._id)
    },
    async getDocument(id) {
      return structuredClone(documents.get(id))
    },
    patch(id) {
      const patches = []
      return {
        setIfMissing(values) {
          patches.push(values)
          return this
        },
        async commit() {
          const doc = documents.get(id)
          for (const values of patches) {
            for (const [path, value] of Object.entries(values)) {
              const segments = path.split('.')
              const leaf = segments.pop()
              let target = doc
              for (const segment of segments) target = target[segment]
              if (!(leaf in target)) target[leaf] = structuredClone(value)
            }
          }
          writes.push(id)
        },
      }
    },
  }
  return {client, documents, writes}
}

test('all releases and nine locales share the root folder; articles keep their own folders', () => {
  const locales = ['en', 'ru', 'pt', 'es', 'fr', 'de', 'tr', 'uk', 'zh']
  const paths = locales.map((language) =>
    getDocumentMediaFolder({
      _type: 'version',
      version: 'v2.0.0',
      language,
    }),
  )
  assert.deepEqual([...new Set(paths)], ['version-history'])
  assert.equal(getDocumentMediaFolder({_type: 'version', version: 'v2.21.0'}), 'version-history')
  assert.equal(getDocumentMediaFolder({_type: 'version'}), 'version-history')
  assert.equal(
    getDocumentMediaFolder({_type: 'article', slug: {current: 'article-name'}}),
    'blog/article-name',
  )
  assert.equal(
    getDocumentMediaFolder({_type: 'page', slug: {current: 'platform/mobile'}}),
    'platform/mobile',
  )
  assert.equal(getDocumentMediaFolder({_type: 'page', slug: {current: '/'}}), 'home')
  assert.equal(getDocumentMediaFolder({_type: 'article'}), undefined)
  assert.equal(getDocumentMediaFolder({_type: 'media.folder', name: 'blog'}), undefined)
  assert.equal(getDocumentMediaFolder({_type: 'article', slug: {current: '../article'}}), undefined)
})

test('only image selection/upload patches trigger organization; captions and crop edits do not', () => {
  assert.equal(
    getSelectedImageAssetId([
      {type: 'setIfMissing', path: [], value: {_type: 'image'}},
      {type: 'set', path: ['asset'], value: {_type: 'reference', _ref: 'image-cover'}},
    ]),
    'image-cover',
  )
  assert.equal(
    getSelectedImageAssetId([
      {type: 'set', path: [], value: {_type: 'image', asset: {_ref: 'image-pasted'}}},
    ]),
    'image-pasted',
  )
  assert.equal(
    getSelectedImageAssetId([{type: 'set', path: ['asset', '_ref'], value: 'image-uploaded'}]),
    'image-uploaded',
  )
  assert.equal(
    getSelectedImageAssetId([{type: 'set', path: ['alt'], value: 'image-caption'}]),
    undefined,
  )
  assert.equal(
    getSelectedImageAssetId([{type: 'set', path: ['crop'], value: {top: 0.1}}]),
    undefined,
  )
  assert.equal(
    getSelectedImageAssetId([
      {type: 'set', path: ['asset'], value: {_ref: 'image-removed'}},
      {type: 'unset', path: ['asset']},
    ]),
    undefined,
  )
})

test('concurrent uploads create a single hierarchy and repeat runs reuse it', async () => {
  const {client, documents, writes} = createDataset()
  const ids = await Promise.all(
    Array.from({length: 9}, () => ensureMediaFolder(client, 'blog/article-name')),
  )
  assert.equal(new Set(ids).size, 1)
  assert.equal(documents.size, 2)
  assert.equal(writes.length, 2)
  const leaf = documents.get(ids[0])
  assert.equal(leaf.name, 'article-name')
  assert.equal(documents.get(leaf.parent._ref).name, 'blog')
  assert.equal(leaf.parent._weak, true)
  assert.equal(await ensureMediaFolder(client, 'blog/article-name'), ids[0])
  assert.equal(writes.length, 2)
})

test('folders created manually in Media are reused, including case differences', async () => {
  const {client, documents, writes} = createDataset([
    {_id: 'manual-blog', _type: 'media.folder', name: 'Blog'},
    {
      _id: 'manual-article',
      _type: 'media.folder',
      name: 'article-name',
      parent: {_ref: 'manual-blog'},
    },
  ])
  assert.equal(await ensureMediaFolder(client, 'blog/article-name'), 'manual-article')
  assert.equal(documents.size, 2)
  assert.equal(writes.length, 0)
})

test('filing an image preserves its metadata and a shared image stays in its original folder', async () => {
  const {client, documents, writes} = createDataset([
    {
      _id: 'image-new',
      _type: 'sanity.imageAsset',
      title: 'Cover',
      opt: {media: {tags: [{_ref: 'tag-1'}]}},
    },
    {
      _id: 'image-shared',
      _type: 'sanity.imageAsset',
      opt: {media: {folder: {_ref: 'original-folder'}}},
    },
  ])
  await assignImageToMediaFolder(client, 'image-new', 'blog/article-name')
  const image = documents.get('image-new')
  assert.equal(image.title, 'Cover')
  assert.deepEqual(image.opt.media.tags, [{_ref: 'tag-1'}])
  assert.equal(documents.get(image.opt.media.folder._ref).name, 'article-name')
  assert.equal(image.opt.media.folder._weak, true)
  const writeCount = writes.length
  await assignImageToMediaFolder(client, 'image-shared', 'blog/another-article')
  assert.equal(documents.get('image-shared').opt.media.folder._ref, 'original-folder')
  assert.equal(writes.length, writeCount)
})

test('a concurrent manual move wins over automatic folder assignment', async () => {
  const {client, documents} = createDataset([{_id: 'image-race', _type: 'sanity.imageAsset'}])
  const originalPatch = client.patch
  client.patch = (id) => {
    documents.get(id).opt = {media: {folder: {_ref: 'chosen-manually'}}}
    return originalPatch(id)
  }
  await assignImageToMediaFolder(client, 'image-race', 'blog/article-name')
  assert.equal(documents.get('image-race').opt.media.folder._ref, 'chosen-manually')
})

test('invalid paths create nothing, and permission failures are surfaced to the editor', async () => {
  const {client, writes} = createDataset([{_id: 'image-new', _type: 'sanity.imageAsset'}])
  await assert.rejects(ensureMediaFolder(client, 'blog/../article'), /Invalid media folder path/)
  await assert.rejects(ensureMediaFolder(client, ''), /Invalid media folder path/)
  assert.equal(writes.length, 0)
  client.createIfNotExists = async () => {
    throw new Error('Permission denied')
  }
  await assert.rejects(
    assignImageToMediaFolder(client, 'image-new', 'blog/article'),
    /Permission denied/,
  )
})
