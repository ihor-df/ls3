import type {SanityClient} from 'sanity'

export const MEDIA_API_VERSION = '2026-08-13'

type MediaDocument = {
  _type?: string
  slug?: {current?: string}
  version?: string
  name?: string
}

type MediaFolder = {
  _id: string
  _type: 'media.folder'
  name: string
  parent?: {_type: 'reference'; _ref: string; _weak: true}
}

type ImageAsset = {
  _id: string
  _type: string
  opt?: {media?: {folder?: {_ref?: string}}}
}

type ImagePatch = {
  type: string
  path: readonly unknown[]
  value?: unknown
}

export function getDocumentMediaFolder(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const document = value as MediaDocument

  const slug = document.slug?.current
  let path: string | undefined

  switch (document._type) {
    case 'article':
      path = slug ? `blog/${slug}` : undefined
      break
    case 'version':
      path = 'version-history'
      break
    case 'partner':
      path = slug ? `partners/${slug}` : undefined
      break
    case 'publication':
      path = slug ? `publications/${slug}` : undefined
      break
    case 'page':
      path = slug === '/' ? 'home' : slug
      break
    case 'author':
      path = document.name ? `authors/${document.name}` : undefined
      break
  }

  if (!path) return undefined

  const segments = path
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.trim())
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) return undefined

  return (
    segments.map((segment) => segment.toLowerCase().replace(/\s+/g, '-')).join('/') || undefined
  )
}

/** Only reacts to a local image selection/upload, never to opening a document. */
export function getSelectedImageAssetId(patches: readonly ImagePatch[]): string | undefined {
  let assetId: unknown

  for (const patch of patches) {
    if (patch.type === 'unset' && (patch.path.length === 0 || patch.path[0] === 'asset')) {
      assetId = undefined
      continue
    }
    if (patch.type !== 'set' && patch.type !== 'setIfMissing') continue

    if (patch.path.length === 2 && patch.path[0] === 'asset' && patch.path[1] === '_ref') {
      assetId = patch.value
    } else if (patch.path.length === 1 && patch.path[0] === 'asset') {
      assetId = (patch.value as {_ref?: unknown} | undefined)?._ref
    } else if (patch.path.length === 0) {
      assetId = (patch.value as {asset?: {_ref?: unknown}} | undefined)?.asset?._ref
    }
  }

  return typeof assetId === 'string' && assetId.startsWith('image-') ? assetId : undefined
}

async function folderIdForPath(path: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(path))
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
  return `media.folder.${hash}`
}

/** Uses the plugin's native hierarchy and reuses folders created manually in Media. */
export async function ensureMediaFolder(client: SanityClient, path: string): Promise<string> {
  const segments = path.split('/')
  if (segments.some((segment) => !segment.trim() || segment === '.' || segment === '..')) {
    throw new Error('Invalid media folder path')
  }

  let parentId: string | null = null
  const ancestors: string[] = []

  for (const name of segments) {
    ancestors.push(name)
    const existing: MediaFolder | null = await client.fetch(
      `*[_type == "media.folder" && !(_id in path("drafts.**")) &&
        lower(name) == lower($name) &&
        (($parentId == null && !defined(parent._ref)) || parent._ref == $parentId)
      ] | order(_createdAt asc, _id asc)[0]`,
      {name, parentId},
      {useCdn: false, perspective: 'raw'},
    )

    const folder: MediaFolder =
      existing ??
      (await client.createIfNotExists<MediaFolder>({
        _id: await folderIdForPath(ancestors.join('/').toLowerCase()),
        _type: 'media.folder',
        name,
        ...(parentId
          ? {parent: {_type: 'reference' as const, _ref: parentId, _weak: true as const}}
          : {}),
      }))
    parentId = folder._id
  }

  return parentId!
}

/** A shared/reused asset keeps its existing folder, including during concurrent edits. */
export async function assignImageToMediaFolder(
  client: SanityClient,
  assetId: string,
  path: string,
): Promise<void> {
  const asset = await client.getDocument<ImageAsset>(assetId)
  if (!asset || asset._type !== 'sanity.imageAsset' || asset.opt?.media?.folder?._ref) return

  const folderId = await ensureMediaFolder(client, path)

  await client
    .patch(assetId)
    .setIfMissing({opt: {}})
    .setIfMissing({'opt.media': {}})
    .setIfMissing({
      'opt.media.folder': {_type: 'reference', _ref: folderId, _weak: true},
    })
    .commit()
}
