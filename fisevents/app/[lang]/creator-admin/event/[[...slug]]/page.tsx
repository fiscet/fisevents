import { authOptions } from '@/lib/authOptions';
import { getEventSingle } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { EventSingle } from '../../features/EventSingle';
import BasicPage from '../../components/BasicPage';

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

  const eventSingleData =
    slug && slug.length > 0
      ? await getEventSingle({
          createdBy: session.user!.uid as string,
          slug: slug[0]
        })
      : undefined;

  return (
    <BasicPage>
      <EventSingle
        eventSingleData={eventSingleData}
        dictionary={dictionary.creator_admin.events}
      />
    </BasicPage>
  );
}
