import { getEventSingleBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getEmailDictionary } from '@/lib/i18n.utils';
import PublicEvent from '../_components/PublicEvent';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import EventUnsuscribe from '../_features/EventUnsuscribe';

export default async function UnsuscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{
    eventId: string;
    eventSlug: string;
    eventAttendantUuid: string;
    eventAttendantEmail: string;
  }>;
}) {
  const { lang } = await params;
  const { eventId, eventSlug, eventAttendantUuid, eventAttendantEmail } = await searchParams;
  const eventData = await getEventSingleBySlug({ slug: eventSlug });
  const userData = await getUserBySlug({ slug: eventData.organizationSlug });
  const emailDictionary = await getEmailDictionary(lang);

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
          eventAttendantEmail={eventAttendantEmail}
          eventTitle={eventData.title ?? ''}
          companyName={eventData.companyName}
          emailDictionary={emailDictionary.event_attendant.unsubscription}
        />
      </NotificationProvider>
    </div>
  );
}
