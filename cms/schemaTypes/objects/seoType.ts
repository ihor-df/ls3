import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => [
        rule.required().warning('Meta title is recommended'),
        rule.max(60).warning('SEO titles longer than 60 characters may be truncated'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule.required().warning('Meta description is recommended'),
        rule.max(160).warning('SEO descriptions longer than 160 characters may be truncated'),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      description: 'Recommended size: 1200 × 630 px',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Prevent this page from indexing by setting robots: noindex, follow',
      initialValue: false,
    }),
  ],
})
