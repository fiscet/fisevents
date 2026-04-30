import type { Metadata } from 'next';
import { Locale } from '@/lib/i18n';
import { getAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: getAlternates('/privacy-cookie-policy', lang) };
}

export default async function PrivacyCookiePrivacyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
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
