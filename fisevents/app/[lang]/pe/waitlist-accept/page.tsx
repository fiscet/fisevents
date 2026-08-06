import { getEventSingleBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import PublicEvent from '../_components/PublicEvent';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import EventWaitlistAccept from '../_features/EventWaitlistAccept';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token';

export default async function WaitlistAcceptPage({
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
    return <p className="text-center mt-10">Invalid or expired link.</p>;
  }

  const { eventId, uuid: eventAttendantUuid } = payload;

  const eventData = await getEventSingleBySlug({ slug: eventSlug });

  if (!eventData) {
    throw new Error('Event not found');
  }

  const userData = await getUserBySlug({ slug: eventData.organizationSlug });

  return (
    <div>
      <PublicEvent eventData={eventData} userData={userData} lang={lang} />
      <NotificationProvider className="mt-0 md:mt-0">
        <EventWaitlistAccept
          eventId={eventId}
          eventSlug={eventSlug}
          organizationSlug={eventData.organizationSlug}
          eventAttendantUuid={eventAttendantUuid}
          eventTitle={eventData.title ?? ''}
          description={eventData.description ?? undefined}
          location={eventData.location ?? undefined}
          talkTo={eventData.talkTo ?? undefined}
          startDate={eventData.startDate ?? undefined}
          endDate={eventData.endDate ?? undefined}
          timeZone={eventData.timeZone ?? undefined}
          companyName={eventData.companyName}
          organizerEmail={eventData.organizerEmail}
          lang={lang}
        />
      </NotificationProvider>
    </div>
  );
}
