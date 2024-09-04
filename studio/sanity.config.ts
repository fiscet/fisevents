import { defineConfig, SchemaTypeDefinition } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'FisEvents',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: 'production',

  plugins: [structureTool({ structure }), visionTool(), media()],

  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
});

