import Image from 'next/image';
import { getEventSingleBySlug, getOrganizationBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary, getEmailDictionary } from '@/lib/i18n.utils';
import EventNotFound from '../../components/EventNotFound';
import PublicEvent from '../../components/PublicEvent';
import EventAttendantForm from '../../features/EventAttendantContainer';
import { NotificationProvider } from '@/components/Notification/NotificationContext';

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
  const organizationData = await getOrganizationBySlug({ organizationSlug });
  const eventData = await getEventSingleBySlug({ slug: eventSlug });

  const dictionary = await getDictionary(lang);
  const emailDictionary = await getEmailDictionary(lang);

  const showForm =
    !!eventData &&
    (eventData.remainingPlaces == null || eventData.remainingPlaces > 0);

  return (
    <div>
      {organizationData && (
        <Image
          src={organizationData.imageUrl ?? '/img/logo.png'}
          alt="Logo"
          width="320"
          height="320"
          className="mx-auto"
        />
      )}
      {eventData && organizationSlug === eventData.organizationSlug ? (
        <>
          <PublicEvent eventData={eventData} lang={lang} />

          {showForm && (
            <NotificationProvider className="mt-0 md:mt-0">
              <EventAttendantForm
                lang={lang}
                eventId={eventData._id!}
                eventSlug={eventSlug}
                companyName={organizationData.companyName!}
                eventTitle={eventData.title!}
                dictionary={dictionary.public}
                emailDictionary={emailDictionary.event_attendant.subscription}
              />
            </NotificationProvider>
          )}
        </>
      ) : (
        <EventNotFound message={dictionary.public.event_not_found} />
      )}
    </div>
  );
}
