import type {SlugIsUniqueValidator} from 'sanity'

export const isUniqueSlugByLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const {document, getClient} = context

  const id = document?._id.replace(/^drafts\./, '')
  const language = document?.language

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    language,
    type: document?._type,
  }

  const query = `
    !defined(*[
      _type == $type &&
      slug.current == $slug &&
      language == $language &&
      !(_id in [$draft, $published])
    ][0]._id)
  `

  return await getClient({apiVersion: '2026-08-17'}).fetch(query, params)
}
