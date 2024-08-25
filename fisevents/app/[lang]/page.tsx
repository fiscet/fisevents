import { getServerSession } from 'next-auth';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import LogoutLink from './creator-admin/components/LogoutLinkContainer';
import { Button } from '@/components/ui/button';
import { CreatorAdminRoutes } from '@/lib/routes';

export default async function MainPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(lang);

  return (
    <div className="p-10">
      <h1>Hello :-)</h1>
      {session ? (
        <div>
          <h2>Logged IN</h2>
          <Link href={`/${CreatorAdminRoutes.getBase()}`}>Creator Admin</Link>
          <div>OR</div>
          <LogoutLink dictionary={dictionary.auth} />
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
