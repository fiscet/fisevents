import { authOptions } from '@/lib/authOptions';
import { getEventSingleById, getEventIdList, getUser } from '@/lib/actions';
import { getServerSession } from 'next-auth';
import EventSingle from '../features/EventSingleContainer';

export async function generateStaticParams() {
  const slugData = await getEventIdList({
    active: true
  });

  if (!slugData.length) {
    return []; // Return an empty array if there are no events
  }

  return slugData.map((id) => ({
    slug: [id._id]
  }));
}

export default async function EventSinglePage({
  params: { slug }
}: {
  params: { slug?: string[] };
}) {
  const session = await getServerSession(authOptions);

  const userData = await getUser({ userId: session!.user!.uid! });

  if (!userData.slug) {
    return <></>;
  }

  const eventSingleData =
    slug && slug.length > 0 && session?.user
      ? await getEventSingleById({
        createdBy: session.user.uid as string,
        id: slug[0]
      })
      : undefined;

  return (
    <EventSingle
      eventSingleData={eventSingleData}
      companySlug={userData.slug.current!}
    />
  );
}
