import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { NavBar } from './_components/NavBar';
import DefaultFooter from '@/components/DefaultFooter';
import { getSession } from '@/lib/auth';

export default async function WebsiteLayout({
  params: { lang },
  children
}: {
  params: { lang: Locale };
  children: React.ReactNode;
}) {
  const session = await getSession();
  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <div className="text-gray-800 flex flex-col min-h-screen">
        <NavBar lang={lang} isLoggedIn={!!session?.user?.email} />
        <main className="container max-w-[1240px] bg-white mx-auto px-4 mt-[115px] md:mt-[150px] xl:mt-[170px] flex-grow">
          {children}
        </main>
        <DefaultFooter showBugReport={false} />
      </div>
    </DictionaryProvider>
  );
}
