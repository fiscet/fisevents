import { sanityClient } from './sanity.cli';
import {
  landingPageBySlugQuery,
  allPublishedLandingPageSlugsQuery,
} from './queries';
import { LandingPage } from '@/types/sanity.extended.types';

export const getLandingPageBySlug = (slug: string) =>
  sanityClient.fetch<LandingPage | null>(
    landingPageBySlugQuery,
    { slug },
    { next: { revalidate: 3600, tags: [`landingPage:${slug}`] } }
  );

export const getAllPublishedLandingPageSlugs = () =>
  sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
    allPublishedLandingPageSlugsQuery,
    {},
    { next: { revalidate: 3600 } }
  );
