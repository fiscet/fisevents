import { getEventSingleBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getEmailDictionary } from '@/lib/i18n.utils';
import EventNotFound from '../../_components/EventNotFound';
import PublicEvent from '../../_components/PublicEvent';
import EventAttendantForm from '../../_features/EventAttendantContainer';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import { revalidateTag } from 'next/cache';
import { PublicRoutes } from '@/lib/routes';

export default async function PublicEventPage({
  params: {
    lang,
    ['organization-slug']: organizationSlug,
    ['event-slug']: eventSlug
  }
}: {
  params: {
    lang: Locale;
    ['organization-slug']: string;
    ['event-slug']: string;
  };
}) {
  const peSlug = PublicRoutes.getBase();

  revalidateTag(`eventSingleBySlug:${eventSlug}`);

  const eventData = await getEventSingleBySlug({
    slug: `${peSlug}/${organizationSlug}/${eventSlug}`
  });
  const userData = await getUserBySlug({ slug: eventData.organizationSlug });
  const emailDictionary = await getEmailDictionary(lang);

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
                emailDictionary={emailDictionary.event_attendant.subscription}
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
