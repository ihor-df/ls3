import assert from 'node:assert/strict'
import {markdownToPortableText} from '@portabletext/markdown'
import {locales} from './context.mjs'

export function normalizedText(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/^[\t ]*[•●*-]+[\t ]*/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[\s*_`\uFEFF]/g, '')
}

export function convertBody(description) {
  assert.equal(typeof description, 'string')
  assert(description.trim(), 'Description is empty')
  // Strapi mixes Markdown lists and literal bullet glyphs, including CJK lists
  // whose leading hyphens are not followed by a space.
  const paragraphs = description
    .replace(/\r\n?/g, '\n')
    .replace(/^([ \t]*)[•●-][ \t]*(?=\S)/gm, '$1- ')
    .split(/\n[\t ]*\n+/)
  const ordinal = (paragraph) => paragraph?.match(/^[\t ]*(\d+)\.[\t ]+/)?.[1]
  const markdown = paragraphs
    .map((paragraph, index) => {
      const number = ordinal(paragraph)
      if (!number) return paragraph
      // Portable Text has no ordered-list start offset. Numbered section headings
      // separated by prose must retain their literal numbers instead of becoming
      // unrelated lists that restart at 1. Keep actual consecutive 1,2,... lists.
      let start = index
      let end = index
      while (
        start > 0 &&
        Number(ordinal(paragraphs[start - 1])) === Number(ordinal(paragraphs[start])) - 1
      )
        start--
      while (
        end < paragraphs.length - 1 &&
        Number(ordinal(paragraphs[end + 1])) === Number(ordinal(paragraphs[end])) + 1
      )
        end++
      const multilineList = paragraph.split('\n').filter((line) => ordinal(line)).length > 1
      if (Number(ordinal(paragraphs[start])) === 1 && (end > start || multilineList))
        return paragraph
      return paragraph.replace(/^([\t ]*\d+)\./gm, '$1\\.')
    })
    .join('\n\n')
  let nextKey = 0
  const body = markdownToPortableText(markdown, {
    keyGenerator: () => `k${(nextKey++).toString(36)}`,
    html: {inline: 'text'},
  })
  assert(body.length, 'Conversion produced an empty body')
  const keys = new Set()
  for (const block of body) {
    assert.equal(block._type, 'block', `Unsupported body type: ${block._type}`)
    assert(['normal', 'h2', 'h3'].includes(block.style), `Unsupported style: ${block.style}`)
    assert(!keys.has(block._key), 'Duplicate block key')
    keys.add(block._key)
    assert(!block.listItem || ['bullet', 'number'].includes(block.listItem))
    for (const span of block.children) {
      assert.equal(span._type, 'span')
      assert.equal(typeof span.text, 'string')
      assert(span._key)
      assert(
        span.marks.every(
          (mark) =>
            ['strong', 'em', 'code', 'highlight'].includes(mark) ||
            block.markDefs.some((definition) => definition._key === mark),
        ),
      )
    }
  }
  const output = body.map((block) => block.children.map((span) => span.text).join('')).join('\n')
  const actual = normalizedText(output)
  const expected = normalizedText(description)
  if (actual !== expected) {
    let offset = 0
    while (actual[offset] === expected[offset] && offset < expected.length) offset++
    throw new Error(
      `Body conversion changed source text at ${offset}: ${JSON.stringify(expected.slice(offset, offset + 80))} -> ${JSON.stringify(actual.slice(offset, offset + 80))}`,
    )
  }
  return body
}

export function buildPlan(records, backup, assets) {
  const existingVersions = backup.filter((doc) => doc._type === 'version')
  assert(
    !existingVersions.some((doc) => doc._id.startsWith('drafts.')),
    'Existing version drafts need review',
  )
  const existingByKey = new Map()
  for (const doc of existingVersions) {
    const key = `${doc.version}:${doc.language}`
    assert(!existingByKey.has(key), `Duplicate target version: ${key}`)
    existingByKey.set(key, doc)
  }
  const metadata = backup.filter((doc) => doc._type === 'translation.metadata')
  const groups = Map.groupBy(records, (record) => record.documentId)
  const releases = []
  const usedExisting = new Set()
  for (const [sourceId, translations] of groups) {
    const english = translations.find((record) => record.locale === 'en')
    assert(english, `No English source: ${sourceId}`)
    const version = english.slug
    assert(/^v\d+\.\d+\.\d+$/.test(version), `Unexpected version: ${version}`)
    assert.deepEqual(
      translations.map((record) => record.locale).sort(),
      [...locales].sort(),
      `Incomplete locales: ${version}`,
    )
    const asset = assets.find((item) => item.version === version)
    assert(asset, `No downloaded cover: ${version}`)
    const documents = locales.map((language) => {
      const source = translations.find((record) => record.locale === language)
      assert(source.publishedAt && source.title?.trim() && source.slug === version)
      assert.equal(source.cover.id, asset.sourceId)
      assert.equal(
        source.releaseDate,
        english.releaseDate,
        `Localized date differs: ${version}:${language}`,
      )
      assert.equal(new Date(source.releaseDate).toISOString().slice(0, 10), source.releaseDate)
      const previous = existingByKey.get(`${version}:${language}`)
      if (previous) usedExisting.add(previous._id)
      const cover = {
        _type: 'image',
        asset: {_type: 'reference', _ref: `migration-source-cover-${asset.sourceId}`},
        alt: source.title,
      }
      if (previous?.cover?.asset?._ref.split('-')[1] === asset.sha1) {
        if (previous.cover.crop) cover.crop = previous.cover.crop
        if (previous.cover.hotspot) cover.hotspot = previous.cover.hotspot
      }
      let body
      try {
        body = convertBody(source.description)
      } catch (error) {
        throw new Error(`${version}:${language}: ${error.message}`)
      }
      return {
        previousRev: previous?._rev,
        document: {
          // Dotted IDs are private paths in Sanity, even in a public dataset.
          _id: previous?._id ?? `version-strapi-${sourceId}-${language}`,
          _type: 'version',
          language,
          version,
          releaseDate: source.releaseDate,
          releaseType: 'major',
          cover,
          body,
        },
      }
    })
    const ids = documents.map((item) => item.document._id)
    const matchingMetadata = metadata.filter((doc) =>
      doc.translations?.some((item) => ids.includes(item.value?._ref)),
    )
    assert(matchingMetadata.length <= 1, `Multiple translation groups: ${version}`)
    const previous = matchingMetadata[0]
    assert(
      !previous?.translations.some((item) => item.value?._ref && !ids.includes(item.value._ref)),
      `Unrelated translation in ${version}`,
    )
    releases.push({
      sourceId,
      version,
      asset,
      documents,
      metadata: {
        previousRev: previous?._rev,
        document: {
          _id: previous?._id ?? `translation-metadata-strapi-version-${sourceId}`,
          _type: 'translation.metadata',
          schemaTypes: ['version'],
          translations: documents.map(({document}) => ({
            _key:
              previous?.translations.find((item) => item.language === document.language)?._key ??
              document.language,
            _type: 'internationalizedArrayReferenceValue',
            language: document.language,
            value: {_type: 'reference', _ref: document._id},
          })),
        },
      },
    })
  }
  assert.equal(
    usedExisting.size,
    existingVersions.length,
    'Some existing versions are absent from source',
  )
  assert.equal(
    new Set(releases.map((release) => release.version)).size,
    releases.length,
    'Duplicate source versions',
  )
  releases.sort(
    (a, b) =>
      a.documents[0].document.releaseDate.localeCompare(b.documents[0].document.releaseDate) ||
      a.version.localeCompare(b.version),
  )
  return {
    releases,
    summary: {
      sourceRecords: records.length,
      releases: releases.length,
      locales,
      updateDocuments: usedExisting.size,
      createDocuments: records.length - usedExisting.size,
      updateTranslationGroups: releases.filter((release) => release.metadata.previousRev).length,
      createTranslationGroups: releases.filter((release) => !release.metadata.previousRev).length,
      covers: assets.length,
      reusableCovers: assets.filter((asset) =>
        backup.some((doc) => doc._type === 'sanity.imageAsset' && doc.sha1hash === asset.sha1),
      ).length,
    },
  }
}
