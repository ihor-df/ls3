import {defineField, defineType} from 'sanity'
import {requireEnglishTitle} from '../lib/requireEnglishTitle'

export const articleCategoryType = defineType({
  name: 'articleCategory',
  title: 'ArticleCategory',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required().custom(requireEnglishTitle),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      const resolvedTitle =
        title?.find((item: {language?: string; value?: string}) => item.language === 'en')?.value ??
        title?.[0]?.value ??
        'Untitled'

      return {
        title: resolvedTitle,
        subtitle: slug,
      }
    },
  },
})
