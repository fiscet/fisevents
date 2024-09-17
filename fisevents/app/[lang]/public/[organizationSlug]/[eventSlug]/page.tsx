import { getEventSingleBySlug } from '@/lib/actions';

export default async function PublicEventPage({
  params: { organizationSlug, eventSlug }
}: {
  params: { organizationSlug: string; eventSlug: string };
}) {
  const eventData = await getEventSingleBySlug({ slug: eventSlug });

  console.log(eventData);

  return (
    <div>
      Ciao {organizationSlug} : {eventSlug}
    </div>
  );
}
