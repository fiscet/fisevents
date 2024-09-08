import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getOrganization, getUser } from '@/lib/actions';
import ProfileContainer from '../features/user-account/ProfileContainer';
import { CurrentOrganization } from '@/types/sanity.extended.types';

export default async function AccountPage({
  params: { lang }
}: {
  params: { lang: Locale; slug?: string[] };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const dictionary = await getDictionary(lang);

  const userData = await getUser({ userId: session.user!.uid! });
  const organizationData = userData.curOrganization?._id
    ? await getOrganization({
        organizationId: userData.curOrganization._id
      })
    : ({} as CurrentOrganization);

  console.log(userData);

  return (
    <ProfileContainer
      dictionary={dictionary.creator_admin}
      userData={userData!}
      organizationData={organizationData}
    />
  );
}
