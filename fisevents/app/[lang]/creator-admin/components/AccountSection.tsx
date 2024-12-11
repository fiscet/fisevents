import { getDictionary } from '@/lib/i18n.utils';
import AccountLink from './AccountLink';
import { Locale } from '@/lib/i18n';
import { FDefaultSession } from '@/types/custom.types';
import LogoutLinkContainer from './LogoutLink/LogoutLinkContainer';
import { getUser } from '@/lib/actions';

export default async function AccountSection({
  lang,
  session
}: {
  lang: Locale;
  session: FDefaultSession;
}) {
  const dictionary = await getDictionary(lang);
  const userData = await getUser({ userId: session.user!.uid! });

  return (
    <section className="flex justify-end items-center gap-x-3">
      <AccountLink
        label={`${userData.name} - ${userData.companyName}`}
        pictureUrl={userData.logoUrl ?? userData.image ?? ''}
      />
      <LogoutLinkContainer label={dictionary.auth.logout} />
    </section>
  );
}
