import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from './lib/i18n';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Run the middleware only where a locale redirect can actually happen.
  // Everything else (API routes, Next internals, static assets under /img,
  // the English-only /blog tree, and any file with an extension —
  // manifest.json, sw.js, robots.txt, sitemap.xml, plus bot probes like
  // /.env or /wp-login.php) is excluded, so it never costs a middleware
  // invocation.
  matcher: [
    '/((?!api|_next|blog|img|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|json|js|mjs|map|css|woff|woff2|ttf|eot|pdf|php|env|bak|sql|zip|tar|gz|yml|yaml|ini|asp|aspx|jsp|cgi|sh)$).*)',
  ],
};
