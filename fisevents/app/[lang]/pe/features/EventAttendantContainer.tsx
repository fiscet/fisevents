'use client';

import React, { useState, useTransition } from 'react';
import { getEmailDictionary } from '@/lib/i18n.utils';
import { useEventAttendantForm } from '../hooks/useEventAttendantForm';
import { useManageSubscription } from '../hooks/useManageSubscription';
import { useSubscribeEmail } from '../hooks/useSubscribeEmail';
import { EventAttendant } from '@/types/sanity.types';
import EventAttendantForm from './EventAttendantForm';
import Processing from '@/components/Processing';
import { Locale } from '@/lib/i18n';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventAttendantContainerProps = {
  lang: Locale;
  eventId: string;
  eventSlug: string;
  companyName: string;
  eventTitle: string;
  emailDictionary: Awaited<
    ReturnType<typeof getEmailDictionary>
  >['event_attendant']['subscription'];
};

export default function EventAttendantContainer({
  lang,
  eventId,
  eventSlug,
  companyName,
  eventTitle,
  emailDictionary
}: EventAttendantContainerProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { public: d } = useDictionary();

  const eventAttendantData: Partial<EventAttendant> = {
    fullName: '',
    email: '',
    phone: ''
  };

  const { form } = useEventAttendantForm({
    eventAttendantData
  });

  const {
    generateUnsubscribeLink,
    prepareEmailSubject,
    prepareEmailBodyTxt,
    prepareEmailBodyHtml
  } = useSubscribeEmail({ eventId, companyName, eventTitle, emailDictionary });

  const handleAttendandSubmit = useManageSubscription({
    eventId,
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
        <EventAttendantForm
          form={form}
          onSubmit={handleAttendandSubmit}
        />
      )}
    </>
  );
}
