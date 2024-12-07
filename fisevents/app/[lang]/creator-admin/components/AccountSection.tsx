import { getDictionary } from '@/lib/i18n.utils';
import AccountLink from './AccountLink';
import { Locale } from '@/lib/i18n';
import { FDefaultSession } from '@/types/custom.types';
import LogoutLinkContainer from './LogoutLink/LogoutLinkContainer';

export default async function AccountSection({
  lang,
  session
}: {
  lang: Locale;
  session: FDefaultSession;
}) {
  const dictionary = await getDictionary(lang);

  return (
    <section className="flex justify-end items-center gap-x-3">
      <AccountLink
        label={dictionary.auth.account}
        pictureUrl={session?.user?.image ?? ''}
      />
      <LogoutLinkContainer label={dictionary.auth.logout} />
    </section>
  );
}
