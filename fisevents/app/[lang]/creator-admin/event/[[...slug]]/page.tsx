import { getSession } from '@/lib/auth';
import { getEventSingleById, getEventIdList, getUserById } from '@/lib/actions';
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
  const session = await getSession();

  const userData = await getUserById({ userId: session!.user!.uid! });

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
      organizationSlug={userData.slug.current!}
    />
  );
}
