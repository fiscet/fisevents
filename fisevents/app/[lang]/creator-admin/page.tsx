import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getEventList } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { CreatorAdminRoutes } from '@/lib/routes';

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

  const eventListData = await getEventList({
    createdBy: session.user!.uid as string,
    active: true
  });

  if (!eventListData.length) {
    return redirect(`/${lang}/${CreatorAdminRoutes.getItem('event')}`);
  }

  return <EventList eventListData={eventListData} />;
}
