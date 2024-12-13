import { DictionaryProvider } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';

export default async function AuthLayout({
  params: { lang },
  children
}: {
  params: { lang: Locale };
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[url('/img/main-bg.jpg')] bg-contain">
      <DictionaryProvider dictionary={dictionary}>
        <div className="z-20">{children}</div>
      </DictionaryProvider>
    </div>
  );
}
