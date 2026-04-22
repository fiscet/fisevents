'use client';

import { useCallback } from 'react';
import { addEventAttendant } from '@/lib/actions';
import { sendMail } from '@/lib/send-mail';
import { EventAttendant } from '@/types/sanity.types';
import { useNotification } from '@/components/Notification/useNotification';
import { useDictionary } from '@/app/contexts/DictionaryContext';

type ManageSubscriptionProps = {
  eventId: string;
  organizerEmail?: string;
  startProcessing: (callback: () => void) => void;
  setIsSubscribed: (value: boolean) => void;
  prepareEmailContent: (addAttendantRes: Partial<EventAttendant>) => {
    subject: string;
    text: string;
    html: string;
  };
  prepareOrganizerEmailContent: (addAttendantRes: Partial<EventAttendant>) => {
    subject: string;
    text: string;
    html: string;
  };
};

export function useManageSubscription({
  eventId,
  organizerEmail,
  startProcessing,
  setIsSubscribed,
  prepareEmailContent,
  prepareOrganizerEmailContent,
}: ManageSubscriptionProps) {
  const { showNotification } = useNotification();

  const { public: d } = useDictionary();

  return useCallback(
    async (data: Partial<EventAttendant>) => {
      startProcessing(async () => {
        try {
          const addAttendantRes = await addEventAttendant({
            eventId,
            eventAttendant: data
          });

          if (addAttendantRes) {
            showNotification({
              title: d.success,
              message: d.success_subscribed,
              type: 'success',
            });

            const { subject, text, html } = prepareEmailContent(addAttendantRes);
            const emailRes = await sendMail({
              sendTo: addAttendantRes.email!,
              subject,
              text,
              html,
            });

            if (emailRes?.accepted.length) {
              setIsSubscribed(true);
            }

            if (organizerEmail) {
              const org = prepareOrganizerEmailContent(addAttendantRes);
              await sendMail({
                sendTo: organizerEmail,
                subject: org.subject,
                text: org.text,
                html: org.html,
              });
            }
          }
        } catch (e) {
          const message = e instanceof Error ? d.errors[e.message as keyof typeof d.errors] : d.errors.generic;

          showNotification({
            title: d.errors.default_title,
            message: message,
            type: 'error',
          });
        }
      });
    },
    [eventId, startProcessing, d, showNotification, prepareEmailContent, prepareOrganizerEmailContent, setIsSubscribed, organizerEmail]
  );
}
