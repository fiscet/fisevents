import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import Logo from '@/components/Logo';
import { getDictionary } from '@/lib/i18n.utils';
import PageWrapper from './_components/PageWrapper';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import { CreatorAdminRoutes } from '@/lib/routes';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import AccountSection from './_components/AccountSection';
import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import DefaultFooter from '@/components/DefaultFooter';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getSession();
  const dictionary = await getDictionary(lang);

  if (!session) {
    return redirect('/auth');
  }

  return (
    <DictionaryProvider dictionary={dictionary}>
      <div className="w-full min-h-screen flex flex-col bg-[url('/img/main-bg.jpg')] bg-contain bg-fixed">
        <div className="container bg-white grow  flex flex-col mx-auto p-1 md:p-4 border-x-2 border-orange-200 z-20">
          <header className="md:grid md:grid-cols-3">
            <div className="flex justify-between">
              <LocaleSwitcher curLang={lang} />
              <div className="block md:hidden">
                <AccountSection lang={lang} session={session} />
              </div>
            </div>
            <Logo linkTo={`/${lang}/${CreatorAdminRoutes.getBase()}`} />
            <div className="hidden md:block">
              <AccountSection lang={lang} session={session} />
            </div>
          </header>
          <NotificationProvider>
            <div className="mb-10 md:mt-2">
              <PageWrapper>{children}</PageWrapper>
            </div>
          </NotificationProvider>
        </div>
        <DefaultFooter session={session} />
      </div>
    </DictionaryProvider>
  );
}
