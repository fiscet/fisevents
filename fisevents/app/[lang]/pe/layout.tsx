import { Suspense } from 'react';
import Loading from '../creator-admin/loading';
import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import DefaultFooter from '@/components/DefaultFooter';

export default async function PeLayout({
  params: { lang },
  children
}: {
  params: { lang: Locale };
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <div
        className="bg-slate-50  min-h-screen flex flex-col"
        data-testid="public-layout"
      >
        <div className="grow flex justify-center">
          <div className="bg-white w-full md:w-[700px] h-full p-10">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
        <DefaultFooter />
      </div>
    </DictionaryProvider>
  );
}
