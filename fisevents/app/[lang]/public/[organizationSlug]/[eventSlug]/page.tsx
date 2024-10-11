import Image from 'next/image';
import { getEventSingleBySlug, getOrganizationBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import EventNotFound from '../../components/EventNotFound';
import PublicEvent from '../../components/PublicEvent';
import EventAttendantForm from '../../components/EventAttendantForm';
import { EventAttendant } from '@/types/sanity.types';

export default async function PublicEventPage({
  params: { lang, organizationSlug, eventSlug }
}: {
  params: { lang: Locale; organizationSlug: string; eventSlug: string };
}) {
  const organizationData = await getOrganizationBySlug({ organizationSlug });
  const eventData = await getEventSingleBySlug({ slug: eventSlug });

  const dictionary = await getDictionary(lang);

  const handleAttendandSubmit = (data: Partial<EventAttendant>) => {
    console.log('handleAttendandSubmit', data);
  };

  console.log('eventData', eventData);

  return (
    <div>
      <Image
        src={organizationData.imageUrl ?? '/img/logo.png'}
        alt="Logo"
        width="320"
        height="320"
        className="mx-auto"
      />
      {eventData && organizationSlug === eventData.organizationSlug ? (
        <>
          <PublicEvent eventData={eventData} lang={lang} />
          <EventAttendantForm
            dictionary={dictionary.public}
            onSubmit={handleAttendandSubmit}
          />
        </>
      ) : (
        <EventNotFound message={dictionary.public.event_not_found} />
      )}
    </div>
  );
}
