import { MetadataRoute } from 'next';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fisevents.vercel.app';

const isProduction = process.env.VERCEL_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

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
