import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getUser } from '@/lib/actions';
import UserAccountContainer from './features/UserAccountContainer';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const userData = await getUser({ userId: session.user!.uid! });

  return (
    <UserAccountContainer
      userData={userData}
    />
  );
}
