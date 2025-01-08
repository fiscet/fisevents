'use client';

import React, { useState, useTransition } from 'react';
import { getEmailDictionary } from '@/lib/i18n.utils';
import { useEventAttendantForm } from '../_hooks/useEventAttendantForm';
import { useManageSubscription } from '../_hooks/useManageSubscription';
import { useSubscribeEmail } from '../_hooks/useSubscribeEmail';
import { EventAttendant } from '@/types/sanity.types';
import EventAttendantForm from './EventAttendantForm';
import Processing from '@/components/Processing';
import { Locale } from '@/lib/i18n';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { PublicOccurrenceSingle } from '@/types/sanity.extended.types';

export type EventAttendantContainerProps = {
  lang: Locale;
  eventData: PublicOccurrenceSingle;
  eventSlug: string;
  emailDictionary: Awaited<
    ReturnType<typeof getEmailDictionary>
  >['event_attendant']['subscription'];
};

export default function EventAttendantContainer({
  lang,
  eventData,
  eventSlug,
  emailDictionary
}: EventAttendantContainerProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { public: d } = useDictionary();

  const eventAttendantData: Partial<EventAttendant> = {
    fullName: '',
    email: '',
    phone: '',
    privacyAccepted: false
  };

  const { form } = useEventAttendantForm({
    eventAttendantData
  });

  const {
    generateUnsubscribeLink,
    prepareEmailSubject,
    prepareEmailBodyTxt,
    prepareEmailBodyHtml
  } = useSubscribeEmail({ eventData, emailDictionary });

  const handleAttendandSubmit = useManageSubscription({
    eventId: eventData._id!,
    eventSlug,
    startProcessing,
    setIsSubscribed,
    prepareEmailContent: (addAttendantRes) => {
      const unsubscribeLink = generateUnsubscribeLink(
        lang,
        eventSlug,
        addAttendantRes.uuid!,
        addAttendantRes.email!
      );
      return {
        subject: prepareEmailSubject(),
        text: prepareEmailBodyTxt(addAttendantRes.fullName!, unsubscribeLink),
        html: prepareEmailBodyHtml(addAttendantRes.fullName!, unsubscribeLink)
      };
    }
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
