import { getDictionary } from '@/lib/i18n.utils';
import AccountLink from './AccountLink';
import LogoutLink from './LogoutLink';
import { Locale } from '@/lib/i18n';
import { FDefaultSession } from '@/types/custom.types';

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
      <LogoutLink dictionary={dictionary.auth} />
    </section>
  );
}
