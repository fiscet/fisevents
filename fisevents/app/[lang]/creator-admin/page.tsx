import { redirect } from 'next/navigation';
import { getEventList } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { CreatorAdminRoutes } from '@/lib/routes';
import { getSession } from '@/lib/auth';
import EventListLoader from './event/features/EventListLoader';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const session = await getSession();

  if (!session) {
    return redirect('/auth');
  }

  const eventListData = await getEventList({
    createdBy: session.user!.uid as string,
  });

  if (!eventListData.length) {
    return redirect(`/${lang}/${CreatorAdminRoutes.getItem('event')}`);
  }

  return <EventListLoader eventListData={eventListData} />;
}
