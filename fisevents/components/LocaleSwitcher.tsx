'use client';

import { usePathname } from 'next/navigation';
import { i18n, Locale } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { cn } from '@/lib/utils';

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

  const goToLangPath = (locale: Locale) => {
    window.location.href = redirectedPathName(locale);
  };

  return (
    <Select
      value={curLang}
      onValueChange={(value: Locale) => goToLangPath(value)}
    >
      <SelectTrigger className="border-none">
        <SelectValue placeholder={curLang} />
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((locale) => {
          return (
            <SelectItem value={locale} key={locale}>
              <span
                className={cn(
                  'pr-1',
                  locale === curLang ? 'text-amber-700' : 'text-cyan-700'
                )}
              >
                {locale}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
