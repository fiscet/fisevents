import { getEventSingleBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import EventNotFound from '../../_components/EventNotFound';
import PublicEvent from '../../_components/PublicEvent';
import EventAttendantForm from '../../_features/EventAttendantContainer';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import { PublicRoutes } from '@/lib/routes';

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{
    lang: Locale;
    ['organization-slug']: string;
    ['event-slug']: string;
  }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const organizationSlug = resolvedParams['organization-slug'];
  const eventSlug = resolvedParams['event-slug'];
  const peSlug = PublicRoutes.getBase();

  const eventData = await getEventSingleBySlug({
    slug: `${peSlug}/${organizationSlug}/${eventSlug}`,
  });
  const userData = await getUserBySlug({ slug: eventData.organizationSlug });

  const showForm =
    !!eventData &&
    (!eventData.maxSubscribers ||
      (eventData.maxSubscribers &&
        eventData.maxSubscribers >= 0 &&
        eventData.remainingPlaces > 0)) &&
    Date.parse(eventData.endDate!) >= Date.now();

  return (
    <div>
      {eventData && organizationSlug === eventData.organizationSlug ? (
        <>
          <PublicEvent eventData={eventData} userData={userData} lang={lang} />

          {showForm && (
            <NotificationProvider>
              <EventAttendantForm
                lang={lang}
                eventData={eventData}
                eventSlug={eventSlug}
              />
            </NotificationProvider>
          )}
        </>
      ) : (
        <EventNotFound />
      )}
    </div>
  );
}
