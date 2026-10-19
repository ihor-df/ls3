import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'
import {LocalizedTextValue, validateLocalizedText} from './objects/localizedSeoType'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
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
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
