import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'
import {isUniqueSlugByLanguage} from '../lib/isUniqueSlugByLanguage'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'mainTitle',
      title: 'Main title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'mainTitle',
        isUnique: isUniqueSlugByLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'mainTitle',
      slug: 'slug.current',
      language: 'language',
    },
    prepare({title, slug, language}) {
      const details = [slug ? `/${slug}` : undefined, language?.toUpperCase()].filter(Boolean)

      return {
        title: title || 'Untitled page',
        subtitle: details.join(' · '),
      }
    },
  },
})
