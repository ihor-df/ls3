import {defineField, defineType} from 'sanity'

type LocalizedStringValue = {
  language?: string
  value?: string
}

const resolveLocalizedTitle = (title?: LocalizedStringValue[]) =>
  title?.find((item) => item.language === 'en' && item.value?.trim())?.value ??
  title?.find((item) => item.value?.trim())?.value ??
  ''

export const partnerCategoryType = defineType({
  name: 'partnerCategory',
  title: 'PartnerCategory',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: (document) =>
          resolveLocalizedTitle(document.title as LocalizedStringValue[] | undefined),
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      const resolvedTitle = resolveLocalizedTitle(title) || 'Untitled'

      return {
        title: resolvedTitle,
        subtitle: slug,
      }
    },
  },
})
