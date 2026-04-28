import { getEventSingleBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import PublicEvent from '../_components/PublicEvent';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import EventUnsuscribe from '../_features/EventUnsuscribe';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token';

export default async function UnsuscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ eventSlug: string; t: string }>;
}) {
  const { lang } = await params;
  const { eventSlug, t } = await searchParams;

  const payload = verifyUnsubscribeToken(t ?? '');
  if (!payload) {
    return <p className="text-center mt-10">Invalid or expired unsubscribe link.</p>;
  }

  const { eventId, uuid: eventAttendantUuid, email: eventAttendantEmail } = payload;

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
          eventAttendantEmail={eventAttendantEmail}
          eventTitle={eventData.title ?? ''}
          companyName={eventData.companyName}
          lang={lang}
        />
      </NotificationProvider>
    </div>
  );
}
