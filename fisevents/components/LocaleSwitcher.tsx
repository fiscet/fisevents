'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n, Locale } from '@/lib/i18n';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function LocaleSwitcher({
  curLang = i18n.defaultLocale
}: {
  curLang?: Locale;
}) {
  const pathName = usePathname();

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <ul className="flex gap-x-2">
      {i18n.locales.map((locale) => {
        return (
          <li key={locale}>
            {locale === curLang && (
              <span className="text-amber-700">{locale}</span>
            )}
            {locale !== curLang && (
              <Link href={redirectedPathName(locale)} className="text-cyan-700">
                {locale}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
