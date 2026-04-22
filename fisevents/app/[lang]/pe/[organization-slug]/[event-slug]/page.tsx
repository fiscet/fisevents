import { getEventSingleBySlug, getEventStatusBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
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
  const fullSlug = `${peSlug}/${organizationSlug}/${eventSlug}`;

  const [eventData, dict] = await Promise.all([
    getEventSingleBySlug({ slug: fullSlug }),
    getDictionary(lang),
  ]);

  if (!eventData) {
    const status = await getEventStatusBySlug({ slug: fullSlug });
    if (status) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-fe-on-surface">{status.title}</h1>
          <p className="text-fe-on-surface-variant max-w-md">
            {status.pendingPayment
              ? dict.public.event_pending_payment
              : dict.public.event_not_available}
          </p>
        </div>
      );
    }
    return <EventNotFound />;
  }

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
