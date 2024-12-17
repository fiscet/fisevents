import { getDictionary } from '@/lib/i18n.utils';
import AccountLink from './AccountLink';
import { Locale } from '@/lib/i18n';
import { FDefaultSession } from '@/types/custom.types';
import LogoutLinkContainer from './LogoutLink/LogoutLinkContainer';
import { getUserById } from '@/lib/actions';

export default async function AccountSection({
  lang,
  session
}: {
  lang: Locale;
  session: FDefaultSession;
}) {
  const d = await getDictionary(lang);
  const userData = await getUserById({ userId: session.user!.uid! });

  return (
    <section className="flex justify-end items-center gap-x-3">
      <AccountLink
        label={`${userData.name} - ${userData.companyName}`}
        pictureUrl={userData.logoUrl ?? userData.image ?? ''}
      />
      <LogoutLinkContainer label={d.auth.logout} />
    </section>
  );
}
