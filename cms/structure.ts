import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Articles')
        .child(
          S.documentList()
            .title('Articles')
            .schemaType('article')
            .filter('_type == "article" && language == $language')
            .params({language: 'en'})
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),

      S.listItem()
        .title('Article Categories')
        .child(
          S.documentList()
            .title('Article Categories')
            .schemaType('articleCategory')
            .filter('_type == "articleCategory"')
            .defaultOrdering([{field: 'slug.current', direction: 'asc'}]),
        ),

      S.documentTypeListItem('author').title('Authors'),
    ])
