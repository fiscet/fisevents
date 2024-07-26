import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import SignInWithGoogle from './components/SignInWithGoogle';
import { getServerSession } from 'next-auth';
import { authOptions } from '../utils/auth';
import { redirect } from 'next/navigation';
import SignInEmail from './components/SignInEmail';

export default async function AuthRoute() {
  const session = await getServerSession(authOptions);

  if (session) {
    console.log({ session });
    return redirect('/');
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Please Sign in</CardTitle>
          <CardDescription>You have to authenticate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <SignInEmail />
            <SignInWithGoogle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
