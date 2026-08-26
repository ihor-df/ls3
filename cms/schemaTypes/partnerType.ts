import {defineField, defineType} from 'sanity'
import {isUniqueSlugByLanguage} from '../lib/isUniqueSlugByLanguage'
import {articleBodyField} from './objects/articleBodyField'

export const partnerType = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'partnerCategory'}],
        },
      ],
      validation: (rule) => rule.required().min(1),
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
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'discountPercent',
      type: 'number',
      validation: (rule) => rule.min(1).max(99),
    }),
    defineField({
      name: 'discountText',
      type: 'string',
    }),
    defineField({
      name: 'promoCode',
      type: 'string',
    }),
    defineField({
      name: 'url',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required().min('1'),
    }),
    defineField({
      name: 'logo',
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
    articleBodyField,
  ],
})
