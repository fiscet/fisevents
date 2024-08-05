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
import Image from 'next/image';
import SignInWithEmail from './components/SignInWithEmail';
import SignInWithGoogle from './components/SignInWithGoogle';
import { Separator } from '@/components/ui/separator';
import { getDictionary } from '@/lib/i18n.utils';
import { Locale } from '@/lib/i18n';

export default async function AuthRoute({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect('/');
  }

  const dictionary = await getDictionary(lang);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[url('/img/login-bg.jpg')] bg-contain">
      <div className="w-screen h-screen flex items-center justify-center bg-white opacity-70 absolute z-10"></div>

      <Card className="w-80 z-20 drop-shadow-2xl">
        <CardHeader>
          <CardTitle>
            <Image src="/img/logo.png" alt="Logo" width="320" height="320" />
            <Separator className="mt-8 mb-4" />
            Please Sign in
          </CardTitle>
          <CardDescription>Choose your authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <SignInWithEmail dictionary={dictionary.auth.login_with_email} />
            <Separator className="my-4" />
            <SignInWithGoogle dictionary={dictionary.auth.login_with_google} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
