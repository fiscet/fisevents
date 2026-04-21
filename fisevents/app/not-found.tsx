import { headers } from 'next/headers';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Link from 'next/link';
import { DictionaryProvider } from './contexts/DictionaryContext';
import { getDictionary } from '@/lib/i18n.utils';
import DefaultFooter from '@/components/DefaultFooter';
import { i18n, Locale } from '@/lib/i18n';
import Image from 'next/image';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

const parseAcceptLanguage = (acceptLanguage: string | null): string[] => {
  if (acceptLanguage === null) return [];

  return acceptLanguage
    .split(',')
    .map(part => {
      const [lang] = part.split(';');
      return lang.split('-')[0];
    })
    .filter((lang, index, self) => self.indexOf(lang) === index)
    .filter(lang => !!lang);
};

const findFirstMatch = (
  userLanguages: string[],
  supportedLanguages: string[]
): string | undefined => {
  return userLanguages.find(lang => supportedLanguages.includes(lang));
};

export default async function NotFound() {
  const headerList = await headers();

  // Array.from(headerList.entries()).forEach(([key, value], index) => {
  //   console.log(`${index} - ${key}: ${value}`);
  // });

  const locales = [...i18n.locales];

  const acceptedLanguages = headerList.get('accept-language');
  const languages = parseAcceptLanguage(acceptedLanguages);
  const userLang = findFirstMatch(languages, locales);

  const dictionary = await getDictionary(userLang as Locale);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <div className="bg-fe-surface w-full flex flex-col min-h-screen">
        <header className="glass-nav fixed top-0 w-full z-50">
          <nav className="px-8 py-4 max-w-7xl mx-auto">
            <Logo />
          </nav>
        </header>
        <main className="flex-grow flex items-center justify-center px-6 pt-[72px]">
          <div className="max-w-3xl w-full bg-fe-surface-container-lowest rounded-3xl shadow-editorial border border-fe-outline-variant/15 p-10 flex flex-col md:flex-row gap-8 items-center">
            <Image
              src="/img/404.jpg"
              alt="404"
              width={360}
              height={360}
              className="rounded-2xl"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-headline font-bold text-fe-on-surface mb-4">
                {dictionary.common.not_found.title}
              </h1>
              <p className="text-fe-on-surface-variant mb-8 leading-relaxed">
                {dictionary.common.not_found.description}
              </p>
              <Button variant="default" size="lg" asChild className="w-full">
                <Link href="/">{dictionary.common.not_found.action}</Link>
              </Button>
            </div>
          </div>
        </main>
        <DefaultFooter />
      </div>
    </DictionaryProvider>
  );
}
