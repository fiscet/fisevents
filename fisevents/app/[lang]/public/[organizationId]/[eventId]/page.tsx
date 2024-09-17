export default async function PublicEventPage({
  params: { organizationId, eventId }
}: {
  params: { organizationId: string; eventId: string };
}) {
  return (
    <div>
      Ciao {organizationId} : {eventId}
    </div>
  );
}
