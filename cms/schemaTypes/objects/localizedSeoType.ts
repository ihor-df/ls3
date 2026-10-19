import {defineField, defineType} from 'sanity'

type LocalizedTextValue = {
  _key: string
  value?: string
}

const validateLocalizedText = (
  translations: LocalizedTextValue[] | undefined,
  label: string,
  maxLength: number,
) => {
  if (!Array.isArray(translations) || !translations.length) {
    return `Meta ${label} is recommended`
  }

  const issues = translations.flatMap(({_key, value}) => {
    const message = !value?.trim()
      ? `Meta ${label} is recommended`
      : value.length > maxLength
        ? `SEO ${label} longer than ${maxLength} characters may be truncated`
        : null

    return message ? [{message, path: [{_key}, 'value']}] : []
  })

  return issues.length ? issues : true
}

export const localizedSeoType = defineType({
  name: 'localizedSeo',
  title: 'Localized SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule
          .custom<LocalizedTextValue[]>((value) => validateLocalizedText(value, 'title', 60))
          .warning(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      validation: (rule) =>
        rule
          .custom<LocalizedTextValue[]>((value) => validateLocalizedText(value, 'description', 160))
          .warning(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      description: 'Shared across languages. Recommended size: 1200 × 630 px',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Shared across languages. Prevent indexing by setting robots: noindex, follow',
      initialValue: false,
    }),
  ],
})
