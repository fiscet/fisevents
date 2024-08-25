import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { getDictionary } from '@/lib/i18n.utils';
import { Locale } from '@/lib/i18n';
import Logo from '@/components/Logo';
import { CreatorAdminRoutes } from '@/lib/routes';
import SignInProviders from './components/SignInProviders';

export default async function AuthPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect(`/${CreatorAdminRoutes}`);
  }

  const dictionary = await getDictionary(lang);

  return (
    <Card className="w-80 drop-shadow-2xl">
      <CardHeader>
        <CardTitle>
          <Logo />
          <Separator className="mt-8 mb-4" />
          Please Sign in
        </CardTitle>
        <CardDescription>Choose your authentication method</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInProviders dictionary={dictionary.auth} />
      </CardContent>
    </Card>
  );
}
