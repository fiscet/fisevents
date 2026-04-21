import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import PageWrapper from './_components/PageWrapper';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import { CreatorAdminRoutes } from '@/lib/routes';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import AccountSection from './_components/AccountSection';
import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import DefaultFooter from '@/components/DefaultFooter';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const session = await getSession();
  const dictionary = await getDictionary(lang);

  if (!session) {
    return redirect(`/${lang}/auth`);
  }

  return (
    <DictionaryProvider dictionary={dictionary}>
      <div className="flex flex-col min-h-screen bg-fe-surface">
        {/* Admin nav bar */}
        <header className="glass-nav fixed top-0 w-full z-50" role="banner">
          <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
            {/* Brand */}
            <Logo
              linkTo={`/${lang}/${CreatorAdminRoutes.getBase()}`}
              height={40}
            />

            {/* Locale + account */}
            <div className="flex items-center gap-4">
              <LocaleSwitcher curLang={lang} />
              <AccountSection lang={lang} session={session} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-grow pt-[72px]" tabIndex={-1}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
            <NotificationProvider>
              <PageWrapper>{children}</PageWrapper>
            </NotificationProvider>
          </div>
        </main>

        <DefaultFooter session={session} />
      </div>
    </DictionaryProvider>
  );
}
