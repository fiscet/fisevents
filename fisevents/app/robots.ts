import { MetadataRoute } from 'next';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fisevents.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/*/creator-admin',
        '/*/auth',
        '/*/account-deleted',
        '/*/waiting-for-the-email',
        '/api/',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
