import {defineField} from 'sanity'

export const articleBodyField = defineField({
  name: 'body',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        // {title: 'Quote', value: 'blockquote'},
      ],
      // lists: [], // Bullet, Numbered
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Highlight', value: 'highlight'},
        ],
        // annotations: [], // ссылка и другие структурированные отметки
      },
    },
    {type: 'articleBodyImage'},
    {type: 'table'},
  ],
})
