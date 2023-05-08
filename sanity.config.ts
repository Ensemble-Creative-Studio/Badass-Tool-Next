import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import StudioNavbar from './app/(user)/components/StudioNavbar'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: 'default',
  title: 'BADASS',
  basePath: "/studio",
  projectId: '6d4oytj2',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  studio:{
components: {
  navbar: StudioNavbar,
}
  },

  schema: {
    types: schemaTypes,
  },
})

