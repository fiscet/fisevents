import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Locale } from '@/lib/i18n';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/lib/i18n.utils';
import { authOptions } from '@/lib/authOptions';
import { getEventList } from '@/lib/fetchers';
import Loading from './loading';

const EventList = dynamic(() => import('./features/EventList'), {
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
    createdBy: session.user!.uid as string
  });

  return (
    <div className="py-1">
      <Suspense fallback={<Loading />}>
        <EventList eventListData={eventListData} />
      </Suspense>
    </div>
  );
}
