import { redirect } from 'next/navigation';
import { getEventList, getUserById } from '@/lib/actions';
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

  const [eventListData, userData] = await Promise.all([
    getEventList({ createdBy: session.user!.uid as string }),
    getUserById({ userId: session.user!.uid as string }),
  ]);

  if (!eventListData.length) {
    if (!userData?.name || !userData?.companyName) {
      return redirect(`/${lang}/${CreatorAdminRoutes.getItem('user-account')}`);
    }
    return redirect(`/${lang}/${CreatorAdminRoutes.getItem('event')}`);
  }

  return (
    <EventListLoader
      eventListData={eventListData}
      orgSlug={userData?.slug?.current}
    />
  );
}
