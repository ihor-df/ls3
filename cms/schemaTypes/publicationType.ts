import {defineField, defineType} from 'sanity'
import {isUniqueSlugByLanguage} from '../lib/isUniqueSlugByLanguage'

export const publicationType = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: isUniqueSlugByLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
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
          description:
            'Leave empty for decorative covers. Describe information that is not already in the linked title.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required().min('1'),
    }),
  ],
})
