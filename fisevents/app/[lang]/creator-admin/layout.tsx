import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GrAlert } from 'react-icons/gr';

import { Locale } from '@/lib/i18n';
import Logo from '@/components/Logo';
import AccountLink from './components/AccountLink';
import LogoutLink from './components/LogoutLink';
import { getDictionary } from '@/lib/i18n.utils';
import DotBg from './components/DotBg';

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
    <div className="w-full h-min-screen flex flex-col bg-[url('/img/main-bg.jpg')] bg-contain">
      <div className="container h-min-screen bg-slate-50 flex flex-col mx-auto p-4 border-x-2 border-orange-200 shadow-2xl z-20">
        <header className="md:grid md:grid-cols-3">
          <div className="hidden md:block">&nbsp;</div>
          <Logo />
          <section className="flex justify-end items-center gap-x-3 mt-5 md:mt-0">
            <div>
              <AccountLink dictionary={dictionary.auth} />
            </div>
            <div>
              <LogoutLink dictionary={dictionary.auth} />
            </div>
          </section>
        </header>

        {!session?.user?.name && (
          <Alert variant="destructive">
            <GrAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Please complete your profile</AlertDescription>
          </Alert>
        )}
        <main className="h-screen my-10 md:mt-14">
          <DotBg className="min-h-full">{children}</DotBg>
        </main>
      </div>
    </div>
  );
}
