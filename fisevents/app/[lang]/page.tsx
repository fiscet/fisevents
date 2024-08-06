import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import LogoutButton from './auth/components/LogoutButton';
import { Button } from '@/components/ui/button';

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-10">
      <h1>Hello :-)</h1>
      {session ? (
        <div>
          <h2>Logged IN</h2>
          <LogoutButton />
        </div>
      ) : (
        <div>
          <h2>Please Login</h2>
          <Button asChild>
            <Link href="/auth">Login here</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
