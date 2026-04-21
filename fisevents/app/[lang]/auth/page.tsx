import { redirect } from 'next/navigation';
import { CreatorAdminRoutes } from '@/lib/routes';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import SignInProviders from './_components/SignInProviders';
import { Separator } from '@/components/ui/separator';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default async function AuthPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const session = await getSession();
  const dict = await getDictionary(lang);
  const d = dict.auth;
  const dc = dict.common;

  if (session) {
    return redirect(`/${lang}/${CreatorAdminRoutes.getBase()}`);
  }

  return (
    <div className="w-full">
      {/* Brand */}
      <div className="flex justify-center mb-8">
        <Logo linkTo={`/${lang}`} height={140} />
      </div>

      {/* Auth card */}
      <div className="bg-fe-surface-container-lowest rounded-3xl p-10 shadow-editorial border border-fe-outline-variant/10">
        <NotificationProvider>
          <h1 className="text-2xl font-headline font-bold text-fe-on-surface mb-2">
            {d.title}
          </h1>
          <p className="text-fe-on-surface-variant mb-8 text-sm leading-relaxed">
            {d.description}
          </p>

          <Separator className="mb-8 bg-fe-outline-variant/20" />

          <SignInProviders />
        </NotificationProvider>
      </div>

      {/* Legal */}
      <p className="text-center text-xs text-fe-on-surface-variant mt-6 leading-relaxed">
        {d.privacy_agree}{' '}
        <Link
          href={`/${lang}/privacy-cookie-policy`}
          className="text-fe-primary underline underline-offset-2"
        >
          {dc.privacy_policy}
        </Link>
        .
      </p>
    </div>
  );
}
