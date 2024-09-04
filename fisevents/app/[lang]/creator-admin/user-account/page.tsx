import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import UserAccount from '../features/user-account/UserAccountContainer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function AccountPage({
  params: { lang }
}: {
  params: { lang: Locale; slug?: string[] };
}) {
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(lang);

  return (
    <UserAccount dictionary={dictionary.creator_admin} session={session!} />
  );
}
