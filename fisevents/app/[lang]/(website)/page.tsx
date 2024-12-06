import { getServerSession } from 'next-auth';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import LogoutLink from '../creator-admin/components/LogoutLink/LogoutLinkContainer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { CreatorAdminRoutes } from '@/lib/routes';
import { NavBar } from './components/NavBar';

export default async function MainPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full h-screen flex items-center justify-center p-10">
      <NavBar
        dictionary={dictionary.auth}
        lang={lang}
        isLoggedIn={!!session?.user?.email}
      />
      <Card>
        <CardHeader>
          <CardTitle>Hello :-)</CardTitle>
          <CardDescription>
            This page will be a landing page for the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <div>
              <h2>You are logged IN as {session.user?.name}</h2>

              <div className="my-4 text-orange-600">
                <Link href={`/${CreatorAdminRoutes.getBase()}`}>
                  Click here for the Creator Admin Panel
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2>You are NOT logged IN</h2>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-end">
            {session ? (
              <LogoutLink dictionary={dictionary.auth} />
            ) : (
              <Button asChild>
                <Link href="/auth">Login here</Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
