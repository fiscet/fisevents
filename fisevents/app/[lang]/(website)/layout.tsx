import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { NavBar } from './_components/NavBar';
import DefaultFooter from '@/components/DefaultFooter';
import { getSession } from '@/lib/auth';
import PWAClient from '@/components/PWA/PWAClient';

export default async function WebsiteLayout({
  params,
  children
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = (await params) as { lang: Locale };
  const session = await getSession();
  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dictionary}>
      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-fe-surface-container-lowest focus:text-fe-on-surface focus:px-6 focus:py-3 focus:rounded-xl focus:shadow-editorial focus:text-sm focus:font-semibold"
      >
        {dictionary.common.skipToMain}
      </a>

      <div className="flex flex-col min-h-screen bg-fe-surface text-fe-on-surface">
        <NavBar lang={lang} isLoggedIn={!!session?.user?.email} />

        <main id="main-content" className="flex-grow pt-[72px]" tabIndex={-1}>
          {children}
        </main>

        <DefaultFooter showBugReport={false} />
      </div>
      <PWAClient />
    </DictionaryProvider>
  );
}
