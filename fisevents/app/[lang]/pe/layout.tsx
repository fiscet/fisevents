import { Suspense } from 'react';
import Loading from '../creator-admin/loading';
import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import DefaultFooter from '@/components/DefaultFooter';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default async function PeLayout({
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
      <div
        className="bg-fe-surface-container-low min-h-screen flex flex-col"
        data-testid="public-layout"
      >
        {/* Minimal top bar with brand */}
        <header className="glass-nav" role="banner">
          <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <Logo linkTo={`/${lang}`} height={36} />
          </div>
        </header>

        {/* Content */}
        <main
          id="main-content"
          className="flex-grow flex justify-center pt-[80px] pb-16 px-4 md:px-6"
          tabIndex={-1}
        >
          <div className="bg-fe-surface-container-lowest w-full max-w-5xl rounded-3xl shadow-editorial border border-fe-outline-variant/10 p-8 md:p-12 h-fit">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </main>

        <DefaultFooter />
      </div>
    </DictionaryProvider>
  );
}
