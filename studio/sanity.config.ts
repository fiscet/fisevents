import { defineConfig, SchemaTypeDefinition } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID as string;

const sharedConfig = {
  projectId,
  plugins: [structureTool({ structure }), visionTool(), media()],
  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
};

export default defineConfig([
  {
    ...sharedConfig,
    name: 'production',
    title: 'FisEvents · Production',
    basePath: '/production',
    dataset: 'production',
  },
  {
    ...sharedConfig,
    name: 'development',
    title: 'FisEvents · Development',
    basePath: '/development',
    dataset: 'development',
  },
]);

