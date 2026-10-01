import {defineField, defineType} from 'sanity'
import {isUniqueSlugByLanguage} from '../lib/isUniqueSlugByLanguage'
import {postBodyField} from './objects/postBodyField'

export const versionType = defineType({
  name: 'version',
  title: 'Version',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'version',
        isUnique: isUniqueSlugByLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cover',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text is important for SEO'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'releaseDate',
      type: 'date',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required().min('1'),
    }),
    defineField({
      name: 'releaseType',
      title: 'Release type',
      type: 'string',
      options: {
        list: [
          {title: 'Major', value: 'major'},
          {title: 'Minor', value: 'minor'},
        ],
      },
      initialValue: 'minor',
      validation: (rule) => rule.required(),
    }),
    postBodyField,
  ],
  preview: {
    select: {
      title: 'version',
      language: 'language',
      media: 'cover',
    },
    prepare({title, language, media}) {
      return {
        title: title || 'Untitled version',
        subtitle: language?.toUpperCase(),
        media,
      }
    },
  },
})
