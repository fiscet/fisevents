import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Locale } from '@/lib/i18n';
import Logo from '@/components/Logo';
import { getDictionary } from '@/lib/i18n.utils';
import PageWrapper from './components/PageWrapper';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import { CreatorAdminRoutes } from '@/lib/routes';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import AccountSection from './components/AccountSection';

export default async function AdminLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(lang);

  if (!session) {
    return redirect('/auth');
  }

  return (
    <div className="w-full min-h-fit h-screen flex flex-col bg-[url('/img/main-bg.jpg')] bg-contain bg-fixed">
      <div className="container bg-white min-h-fit h-screen flex flex-col mx-auto p-4 border-x-2 border-orange-200 shadow-2xl z-20">
        <header className="md:grid md:grid-cols-3">
          <div className="flex justify-between">
            <LocaleSwitcher curLang={lang} />
            <div className="block md:hidden">
              <AccountSection lang={lang} session={session} />
            </div>
          </div>
          <Logo linkTo={`/${CreatorAdminRoutes.getBase()}`} />
          <div className="hidden md:block">
            <AccountSection lang={lang} session={session} />
          </div>
        </header>
        <NotificationProvider>
          <div className="mb-10 md:mt-2">
            <PageWrapper dictionary={dictionary.creator_admin.notifications}>
              {children}
            </PageWrapper>
          </div>
        </NotificationProvider>
      </div>
    </div>
  );
}
