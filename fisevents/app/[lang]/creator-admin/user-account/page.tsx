import { getSession } from '@/lib/auth';
import { getUserById } from '@/lib/actions';
import UserAccountContainer from './features/UserAccountContainer';

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const userData = await getUserById({ userId: session.user!.uid! });

  return <UserAccountContainer userData={userData} />;
}
