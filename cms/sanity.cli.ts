import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
  typegen: {
    path: '../landing/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../landing/src/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    appId: 'n3hh3chw5qp2aqspok9u5ysb',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
