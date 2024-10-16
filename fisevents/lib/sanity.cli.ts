import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'xxx',
  dataset: process.env.SANITY_DATASET ?? 'xxx',
  apiVersion: 'v2023-03-07',
  token: process.env.SANITY_API_TOKEN ?? 'xxx',
  useCdn: process.env.NODE_ENV === 'production'
});