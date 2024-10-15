'use client';

import React, { useState, useTransition } from 'react';
import { getDictionary, getEmailDictionary } from '@/lib/i18n.utils';
import { useEventAttendantForm } from '../hooks/useEventAttendantForm';
import { useManageSubscription } from '../hooks/useManageSubscription';
import { useSubscribeEmail } from '../hooks/useSubscribeEmail';
import { EventAttendant } from '@/types/sanity.types';
import EventAttendantForm from './EventAttendantForm';
import Processing from '@/components/Processing';
import { Locale } from '@/lib/i18n';

export type EventAttendantContainerProps = {
  lang: Locale;
  eventId: string;
  companyName: string;
  eventTitle: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['public'];
  emailDictionary: Awaited<
    ReturnType<typeof getEmailDictionary>
  >['event_attendant']['subscription'];
};

export default function EventAttendantContainer({
  lang,
  eventId,
  companyName,
  eventTitle,
  dictionary,
  emailDictionary
}: EventAttendantContainerProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const eventAttendantData: Partial<EventAttendant> = {
    fullName: '',
    email: '',
    phone: ''
  };

  const { form } = useEventAttendantForm({
    eventAttendantData,
    dictionary
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
    dictionary,
    setIsSubscribed,
    prepareEmailContent: (addAttendantRes) => {
      const unsubscribeLink = generateUnsubscribeLink(
        lang,
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
      {isSaving && <Processing text={dictionary.subscribing} />}
      {!isSubscribed && (
        <EventAttendantForm
          form={form}
          dictionary={dictionary}
          onSubmit={handleAttendandSubmit}
        />
      )}
    </>
  );
}
