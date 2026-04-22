'use client';

import React from 'react';
import { useEventAttendantForm } from '../_hooks/useEventAttendantForm';
import { useManageSubscription } from '../_hooks/useManageSubscription';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Locale } from '@/lib/i18n';
import { EventAttendant } from '@/types/sanity.types';
import { PublicOccurrenceSingle } from '@/types/sanity.extended.types';
import { useEventSubscription } from '@/hooks/useEventSubscription';
import EventAttendantForm from './EventAttendantForm';
import Processing from '@/components/Processing';

export type EventAttendantContainerProps = {
  lang: Locale;
  eventData: PublicOccurrenceSingle;
  eventSlug: string;
};

export default function EventAttendantContainer({
  lang,
  eventData,
  eventSlug,
}: EventAttendantContainerProps) {
  const { isSaving, startProcessing, isSubscribed, setIsSubscribed } = useEventSubscription();
  const { public: d } = useDictionary();

  const eventAttendantData: Partial<EventAttendant> = {
    fullName: '',
    email: '',
    phone: '',
    privacyAccepted: false,
  };

  const { form } = useEventAttendantForm({ eventAttendantData });

  const handleAttendandSubmit = useManageSubscription({
    eventId: eventData._id!,
    lang,
    eventData,
    eventSlug,
    startProcessing,
    setIsSubscribed,
  });

  return (
    <>
      {isSaving && <Processing text={d.subscribing} />}
      {!isSubscribed && (
        <EventAttendantForm form={form} onSubmit={handleAttendandSubmit} />
      )}
    </>
  );
}
