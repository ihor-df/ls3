import type {CustomValidator} from 'sanity'

type LocalizedStringValue = {
  _key?: string
  language?: string
  value?: string
}

export const requireEnglishTitle: CustomValidator<LocalizedStringValue[]> = (translations) => {
  const english = Array.isArray(translations)
    ? translations.find((translation) => translation.language === 'en')
    : undefined

  if (english?.value?.trim()) return true

  const message = 'English title is required'

  return english?._key ? [{message, path: [{_key: english._key}, 'value']}] : message
}
