import { Locale } from '@/lib/i18n';

export default async function PrivacyCookiePrivacyPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const PrivacyAndCookiePolicy = (
    await import(`@/dictionaries/policy/${lang}.tsx`)
  ).default;

  const lastUpdated = new Date('2024-12-17').toLocaleDateString(lang);

  return (
    <div className="py-10 px-6 lg:px-20">
      <PrivacyAndCookiePolicy lastUpdated={lastUpdated} />
    </div>
  );
}
