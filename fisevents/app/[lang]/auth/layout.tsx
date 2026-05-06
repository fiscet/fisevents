import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import PWAClient from '@/components/PWA/PWAClient';

export default async function AuthLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dictionary}>
      {/* Clean surface background — no background image */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-fe-surface px-6">
        {/* Decorative ambient blobs */}
        <div
          className="fixed top-0 right-0 w-[600px] h-[600px] bg-fe-primary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-fe-secondary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
      <PWAClient />
    </DictionaryProvider>
  );
}
