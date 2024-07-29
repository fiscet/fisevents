import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getServerSession } from 'next-auth';
import { authOptions } from '../utils/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import SignInEmail from './components/SignInEmail';
import SignInWithGoogle from './components/SignInWithGoogle';
import { Separator } from '@/components/ui/separator';

export default async function AuthRoute() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect('/');
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[url('/img/login-bg.jpg')] bg-contain">
      <div className="w-screen h-screen flex items-center justify-center bg-white opacity-70 absolute z-10"></div>

      <Card className="w-80 z-20 drop-shadow-2xl">
        <CardHeader>
          <CardTitle>
            <Image src="/img/logo.png" alt="Logo" width="320" height="320" />
            <Separator className="my-4" />
            Please Sign in
          </CardTitle>
          <CardDescription>Choose your authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <SignInEmail />
            <Separator className="my-4" />
            <SignInWithGoogle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
