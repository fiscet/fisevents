import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { CreatorAdminRoutes } from '@/lib/routes';
import SignInProviders from './components/SignInProviders';
import { authOptions } from '@/lib/authOptions';
import { NotificationProvider } from '@/components/Notification/NotificationContext';

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

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
            Please Sign in
          </CardTitle>
          <CardDescription>Choose your authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInProviders />
        </CardContent>
      </NotificationProvider>
    </Card>
  );
}
