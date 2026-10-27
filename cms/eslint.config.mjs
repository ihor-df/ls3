import studio from '@sanity/eslint-config-studio'

export default [
  {ignores: ['backups/**']},
  ...studio,
  {
    files: ['tests/*.test.mjs'],
    languageOptions: {
      globals: {
        structuredClone: 'readonly',
      },
    },
  },
]
