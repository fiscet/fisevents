import { getEventSingleBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import PublicEvent from '../_components/PublicEvent';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import EventUnsuscribe from '../_features/EventUnsuscribe';

export default async function UnsuscribePage({
  params: { lang },
  searchParams: { eventId, eventSlug, eventAttendantUuid }
}: {
  params: { lang: Locale };
  searchParams: {
    eventId: string;
    eventSlug: string;
    eventAttendantUuid: string;
  };
}) {
  const eventData = await getEventSingleBySlug({ slug: eventSlug });
  const userData = await getUserBySlug({ slug: eventData.organizationSlug });

  if (!eventData) {
    throw new Error('Event not found');
  }

  return (
    <div>
      <PublicEvent eventData={eventData} userData={userData} lang={lang} />
      <NotificationProvider className="mt-0 md:mt-0">
        <EventUnsuscribe
          eventId={eventId}
          eventSlug={eventSlug}
          organizationSlug={eventData.organizationSlug}
          eventAttendantUuid={eventAttendantUuid}
        />
      </NotificationProvider>
    </div>
  );
}
