import { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n';
import { sanityClient } from '@/lib/sanity.cli';
import { allPublishedEventSlugsQuery } from '@/lib/queries';

export const revalidate = 3600;

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fisevents.vercel.app';

const STATIC_PATHS = [
  '',
  '/how-it-works',
  '/pricing',
  '/contacts',
  '/privacy-cookie-policy',
  '/terms',
];

const VISIBLE = i18n.visibleLocales;

function langAlternates(path: string) {
  return Object.fromEntries(
    VISIBLE.map(l => [l, `${BASE_URL}/${l}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = VISIBLE.flatMap(lang =>
    STATIC_PATHS.map(path => ({
      url: `${BASE_URL}/${lang}${path}`,
      lastModified: new Date(),
      alternates: { languages: langAlternates(path) },
    }))
  );

  const events = await sanityClient.fetch<
    { publicSlug: string; _updatedAt: string }[]
  >(allPublishedEventSlugsQuery, {}, { next: { revalidate: 3600 } });

  const eventEntries: MetadataRoute.Sitemap = (events ?? []).flatMap(
    ({ publicSlug, _updatedAt }) => {
      if (!publicSlug) return [];
      // publicSlug format: "pe/org-slug/event-slug"
      const path = `/${publicSlug}`;
      return VISIBLE.map(lang => ({
        url: `${BASE_URL}/${lang}${path}`,
        lastModified: new Date(_updatedAt),
        alternates: { languages: langAlternates(path) },
      }));
    }
  );

  return [...staticEntries, ...eventEntries];
}
