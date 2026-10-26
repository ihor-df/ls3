import studio from '@sanity/eslint-config-studio'

export default [
  ...studio,
  {
    files: ['migrations/version-history/*.mjs', 'tests/*.test.mjs'],
    languageOptions: {
      globals: {
        AbortSignal: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        structuredClone: 'readonly',
      },
    },
  },
]
