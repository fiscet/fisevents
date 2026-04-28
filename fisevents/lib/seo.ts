import { i18n, Locale } from '@/lib/i18n';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fisevents.vercel.app';

export function getAlternates(path: string, lang: Locale) {
  const normalizedPath = path === '' || path.startsWith('/') ? path : `/${path}`;
  return {
    canonical: `${BASE_URL}/${lang}${normalizedPath}`,
    languages: {
      ...Object.fromEntries(
        i18n.visibleLocales.map(l => [l, `${BASE_URL}/${l}${normalizedPath}`])
      ),
      'x-default': `${BASE_URL}/${i18n.defaultLocale}${normalizedPath}`,
    },
  };
}
