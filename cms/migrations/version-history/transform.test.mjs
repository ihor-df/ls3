import assert from 'node:assert/strict'
import {test} from 'node:test'
import {locales} from './context.mjs'
import {buildPlan, convertBody} from './transform.mjs'

test('new published IDs stay public and existing document IDs are preserved', () => {
  const records = locales.map((locale) => ({
    documentId: 'source123',
    locale,
    slug: 'v1.0.0',
    publishedAt: '2026-01-01T00:00:00Z',
    releaseDate: '2026-01-01',
    title: 'Release 1',
    description: 'Release notes.',
    cover: {id: 1},
  }))
  const backup = [{_id: 'existing-id', _type: 'version', version: 'v1.0.0', language: 'en'}]
  const assets = [{version: 'v1.0.0', sourceId: 1, sha1: 'original-image'}]
  const plan = buildPlan(records, backup, assets)
  const release = plan.releases[0]
  assert.equal(release.documents[0].document._id, 'existing-id')
  for (const {document} of [...release.documents, release.metadata])
    assert(!document._id.includes('.'), `Private ID: ${document._id}`)
  assert.deepEqual(
    release.metadata.document.translations.map((translation) => translation.value._ref),
    release.documents.map(({document}) => document._id),
  )
})

test('source paragraphs, emphasis and literal bullet glyphs become editable rich text', () => {
  const text = 'Introduction.\n\n*New engine*\n\n• First improvement\n• Second improvement'
  const body = convertBody(text)
  assert.equal(body[0].children[0].text, 'Introduction.')
  assert(body[1].children.some((span) => span.marks.includes('em')))
  assert.equal(body[2].listItem, 'bullet')
  assert.equal(body[3].listItem, 'bullet')
  assert.deepEqual(convertBody(text), body)
})

test('numbered and CJK lists preserve content and numbering semantics', () => {
  const body = convertBody('1. Register\n2. Get token\n\n-改进通知\n-新的功能')
  assert.equal(body[0].listItem, 'number')
  assert.equal(body[1].listItem, 'number')
  assert.equal(body[2].listItem, 'bullet')
  assert.equal(body[2].children[0].text, '改进通知')
})

test('blank descriptions and unsupported content are rejected before writes', () => {
  assert.throws(() => convertBody('  '), /empty/)
  assert.throws(
    () => convertBody('![Unexpected image](https://example.com/image.jpg)'),
    /Unsupported/,
  )
})

test('numbered section headings separated by prose keep their original numbers', () => {
  const body = convertBody(
    '1. First section\n\nDetails.\n\n4. Fourth section\n\nMore details.\n\n1. Step one\n\n2. Step two',
  )
  assert.equal(body[0].listItem, undefined)
  assert.equal(body[0].children[0].text, '1. First section')
  assert.equal(body[2].children[0].text, '4. Fourth section')
  assert.equal(body[4].listItem, 'number')
  assert.equal(body[5].listItem, 'number')
})
