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
    .map((part) => {
      const [lang] = part.split(';');
      return lang.split('-')[0];
    })
    .filter((lang, index, self) => self.indexOf(lang) === index)
    .filter((lang) => !!lang);
};

const findFirstMatch = (
  userLanguages: string[],
  supportedLanguages: string[]
): string | undefined => {
  return userLanguages.find((lang) => supportedLanguages.includes(lang));
};

export default async function NotFound({ params }: { params: any }) {
  const headerList = headers();

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
      <div className="bg-gray-50 w-full flex flex-col min-h-screen">
        <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
          <nav className="container">
            <Logo />
          </nav>
        </header>
        <main className="container mt-[170px] mx-auto px-4 flex-grow">
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-8 flex flex-col md:flex-row gap-4">
            <Image src="/img/404.jpg" alt="404" width={400} height={400} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {dictionary.common.not_found.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {dictionary.common.not_found.description}
              </p>
              <Link href="/">
                <Button variant="success" className="mt-4 w-full">
                  {dictionary.common.not_found.action}
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <DefaultFooter lang={userLang as Locale} />
      </div>
    </DictionaryProvider>
  );
}
