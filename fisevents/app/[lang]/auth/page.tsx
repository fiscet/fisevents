import { redirect } from 'next/navigation';
import { CreatorAdminRoutes } from '@/lib/routes';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import SignInProviders from './_components/SignInProviders';
import Logo from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getSession } from '@/lib/auth';

export default async function AuthPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getSession();
  const d = (await getDictionary(lang)).auth;

  if (session) {
    return redirect(`/${CreatorAdminRoutes.getBase()}`);
  }

  return (
    <Card className="w-80 drop-shadow-2xl">
      <NotificationProvider className="mt-0 md:mt-0">
        <CardHeader>
          <CardTitle>
            <Logo />
            <Separator className="mt-8 mb-4" />
            {d.title}
          </CardTitle>
          <CardDescription>{d.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInProviders />
        </CardContent>
      </NotificationProvider>
    </Card>
  );
}
