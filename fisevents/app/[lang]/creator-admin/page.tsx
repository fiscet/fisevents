import dynamic from 'next/dynamic';
import { Locale } from '@/lib/i18n';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/lib/i18n.utils';
import { authOptions } from '@/lib/authOptions';
import { getEventIdList, getEventList } from '@/lib/actions';

const EventList = dynamic(() => import('./event/features/EventList'), {
  ssr: false
});

export default async function AdminPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/auth');
  }

  const dictionary = await getDictionary(lang);

  const eventListData = await getEventList({
    createdBy: session.user!.uid as string,
    active: true
  });

  return (
    <EventList
      eventListData={eventListData}
      dictionary={dictionary.creator_admin.events}
    />
  );
}
