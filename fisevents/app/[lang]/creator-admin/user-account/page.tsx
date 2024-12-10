import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getUser } from '@/lib/actions';
import UserAccountContainer from './features/UserAccountContainer';

export default async function AccountPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const dictionary = await getDictionary(lang);

  const userData = await getUser({ userId: session.user!.uid! });

  return (
    <UserAccountContainer
      userData={userData}
      dictionary={dictionary.creator_admin}
    />
  );
}
