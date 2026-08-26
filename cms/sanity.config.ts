import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {structure} from './structure'

const languages = [
  {id: 'en', title: 'English'},
  {id: 'ru', title: 'Russian'},
  {id: 'pt', title: 'Portuguese'},
  {id: 'es', title: 'Spanish'},
  {id: 'fr', title: 'French'},
  {id: 'de', title: 'German'},
  {id: 'tr', title: 'Turkish'},
  {id: 'uk', title: 'Ukrainian'},
  {id: 'zh', title: 'Chinese'},
]

export default defineConfig({
  name: 'default',
  title: `LS3 (${process.env.SANITY_STUDIO_DATASET!})`,

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    structureTool({structure}),
    visionTool(),
    documentInternationalization({
      supportedLanguages: languages,
      schemaTypes: ['article', 'partner'],
    }),
    internationalizedArray({
      languages,
      defaultLanguages: ['en'],
      fieldTypes: ['string'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  form: {
    components: {
      portableText: {
        plugins: (props) =>
          props.renderDefault({
            ...props,
            plugins: {
              ...props.plugins,
              table: {
                enabled: true,
              },
            },
          }),
      },
    },
  },
})
