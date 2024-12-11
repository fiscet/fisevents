import { getEventSingleBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import PublicEvent from '../components/PublicEvent';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import EventUnsuscribe from '../features/EventUnsuscribe';

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

  if (!eventData) {
    throw new Error('Event not found');
  }

  return (
    <div>
      <PublicEvent eventData={eventData} lang={lang} />
      <NotificationProvider className="mt-0 md:mt-0">
        <EventUnsuscribe
          eventId={eventId}
          eventSlug={eventSlug}
          companySlug={eventData.organizationSlug}
          eventAttendantUuid={eventAttendantUuid}
        />
      </NotificationProvider>
    </div>
  );
}
