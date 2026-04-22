'use client';

import React from 'react';
import { getEmailDictionary } from '@/lib/i18n.utils';
import { useEventAttendantForm } from '../_hooks/useEventAttendantForm';
import { useManageSubscription } from '../_hooks/useManageSubscription';
import { useSubscribeEmail } from '../_hooks/useSubscribeEmail';
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
  emailDictionary: Awaited<
    ReturnType<typeof getEmailDictionary>
  >['event_attendant']['subscription'];
  organizerEmailDictionary: Awaited<
    ReturnType<typeof getEmailDictionary>
  >['organizer']['new_attendant'];
};

export default function EventAttendantContainer({
  lang,
  eventData,
  eventSlug,
  emailDictionary,
  organizerEmailDictionary,
}: EventAttendantContainerProps) {
  const { isSaving, startProcessing, isSubscribed, setIsSubscribed } = useEventSubscription();

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
    organizerEmail: eventData.organizerEmail,
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
    },
    prepareOrganizerEmailContent: (addAttendantRes) => {
      const subject = organizerEmailDictionary.subject.replace('%event_title%', eventData.title ?? '');
      const text = organizerEmailDictionary.body_txt
        .replaceAll('%event_title%', eventData.title ?? '')
        .replaceAll('%attendant_name%', addAttendantRes.fullName ?? '')
        .replaceAll('%attendant_email%', addAttendantRes.email ?? '');
      const html = organizerEmailDictionary.body_html
        .replaceAll('%event_title%', eventData.title ?? '')
        .replaceAll('%attendant_name%', addAttendantRes.fullName ?? '')
        .replaceAll('%attendant_email%', addAttendantRes.email ?? '');
      return { subject, text, html };
    },
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
