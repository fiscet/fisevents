import { Suspense } from 'react';
import Loading from '../creator-admin/loading';
import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';

export default async  function PeLayout({
  params: {lang},
  children
}: {
  params: {lang: Locale},
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary(lang);
  
  return (
    <div className="bg-slate-50" data-testid="public-layout">
      <div className="flex justify-center min-h-screen">
        <div className="bg-white w-full md:w-[700px] h-full p-10">
          <DictionaryProvider dictionary={dictionary}>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </DictionaryProvider>
        </div>
      </div>
    </div>
  );
}
