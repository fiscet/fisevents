import { i18n, Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { WebsiteRoutes } from '@/lib/routes';
import Link from 'next/link';

export default async function PrivacyCookiePolicyLink({
  lang,
}: {
  lang?: Locale;
}) {
  const currentLang = lang ?? i18n.defaultLocale;

  const dictionary = await getDictionary(currentLang);

  const url = `/${currentLang}/${WebsiteRoutes.getItem(
    'privacy_cookie_policy'
  )}`;

  return (
    <Link
      href={url}
      className="text-fe-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
      target="_blank"
    >
      {dictionary.common.privacy_cookie_policy}
    </Link>
  );
}
