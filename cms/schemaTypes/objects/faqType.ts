import {defineField, defineType} from 'sanity'

export const faqItemType = defineType({
  name: 'faqItem',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
})
