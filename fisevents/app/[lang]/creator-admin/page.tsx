import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getEventList } from '@/lib/actions';

const EventList = dynamic(() => import('./event/features/EventList'), {
  ssr: false
});

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/auth');
  }

  const eventListData = await getEventList({
    createdBy: session.user!.uid as string,
    active: true
  });

  return (
    <EventList
      eventListData={eventListData}
    />
  );
}
