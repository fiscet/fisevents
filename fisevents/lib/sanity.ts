import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: 'v2023-03-07',
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === 'production'
});