import { getSession } from '@/lib/auth';
import { getEventSingleById, getEventIdList, getUserById } from '@/lib/actions';
import EventSingle from '../features/EventSingleContainer';

export async function generateStaticParams() {
  const slugData = await getEventIdList({
    active: true,
  });

  if (!slugData.length) {
    return [];
  }

  return slugData.map(id => ({
    slug: [id._id],
  }));
}

export default async function EventSinglePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const [{ slug }, { from }] = await Promise.all([params, searchParams]);
  const session = await getSession();

  const userData = await getUserById({ userId: session!.user!.uid! });

  if (!userData.slug) {
    return <></>;
  }

  const userId = session!.user!.uid as string;

  // ?from=ID with no slug → duplicate mode
  const isDuplicate = !!from && (!slug || slug.length === 0);

  const eventSingleData = isDuplicate
    ? await getEventSingleById({ createdBy: userId, id: from! })
    : slug && slug.length > 0
    ? await getEventSingleById({ createdBy: userId, id: slug[0] })
    : undefined;

  return (
    <EventSingle
      eventSingleData={eventSingleData}
      organizationSlug={userData.slug.current!}
      isDuplicate={isDuplicate}
    />
  );
}
