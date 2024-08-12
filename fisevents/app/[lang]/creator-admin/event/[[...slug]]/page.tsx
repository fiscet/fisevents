import { authOptions } from '@/lib/authOptions';
import { getEventSingle } from '@/lib/fetchers';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function eventSinglePage({
  params: { lang, slug }
}: {
  params: { lang: Locale; slug?: string[] };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/auth');
  }

  const dictionary = await getDictionary(lang);

  if (slug && slug.length > 0) {
    const eventSingleData = await getEventSingle({
      createdBy: session.user!.uid as string,
      slug: slug[0]
    });
  }

  return <div>Ciao</div>;
}
