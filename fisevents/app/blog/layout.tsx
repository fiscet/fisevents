import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { getDictionary } from '@/lib/i18n.utils';
import { getSession } from '@/lib/auth';
import { NavBar } from '@/app/[lang]/(website)/_components/NavBar';
import DefaultFooter from '@/components/DefaultFooter';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const dictionary = await getDictionary('en');

  return (
    <DictionaryProvider dictionary={dictionary}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-fe-surface-container-lowest focus:text-fe-on-surface focus:px-6 focus:py-3 focus:rounded-xl focus:shadow-editorial focus:text-sm focus:font-semibold"
      >
        {dictionary.common.skipToMain}
      </a>

      <div className="flex flex-col min-h-screen bg-fe-surface text-fe-on-surface">
        <NavBar lang="en" isLoggedIn={!!session?.user?.email} />

        <main id="main-content" className="flex-grow pt-[72px]" tabIndex={-1}>
          {children}
        </main>

        <DefaultFooter showBugReport={false} />
      </div>
    </DictionaryProvider>
  );
}
