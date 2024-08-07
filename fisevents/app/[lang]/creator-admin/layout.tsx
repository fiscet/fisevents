import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GrAlert } from 'react-icons/gr';

import { Locale } from '@/lib/i18n';
import Logo from '@/components/Logo';
import AccountLink from './components/AccountLink';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/auth');
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[url('/img/main-bg.jpg')] bg-contain">
      <div className="w-screen h-screen bg-white opacity-70 absolute z-10"></div>
      <div className="container h-screen bg-slate-50 flex flex-col mx-auto p-4 border-x-2 border-orange-200 shadow-2xl z-20">
        <header>
          <Logo />
        </header>
        <section>
          <div>
            <AccountLink />
          </div>
        </section>
        {!session?.user?.name && (
          <Alert variant="destructive">
            <GrAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Please complete your profile</AlertDescription>
          </Alert>
        )}
        {children}
      </div>
    </div>
  );
}
