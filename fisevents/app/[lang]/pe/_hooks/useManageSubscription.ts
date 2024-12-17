'use client';

import { useCallback } from 'react';
import { addEventAttendant, getEventSingleHasAttendantById } from '@/lib/actions';
import { sendMail } from '@/lib/send-mail';
import { EventAttendant } from '@/types/sanity.types';
import { useNotification } from '@/components/Notification/useNotification';
import { useDictionary } from '@/app/contexts/DictionaryContext';

type ManageSubscriptionProps = {
  eventId: string;
  startProcessing: (callback: () => void) => void;
  setIsSubscribed: (value: boolean) => void;
  prepareEmailContent: (addAttendantRes: Partial<EventAttendant>) => {
    subject: string;
    text: string;
    html: string;
  };
};

export function useManageSubscription({
  eventId,
  startProcessing,
  setIsSubscribed,
  prepareEmailContent,
}: ManageSubscriptionProps) {
  const { showNotification } = useNotification();

  const { public: d } = useDictionary();

  return useCallback(
    async (data: Partial<EventAttendant>) => {
      startProcessing(async () => {
        try {
          const res = await getEventSingleHasAttendantById({
            eventId: eventId,
            email: data.email || '',
          });

          if (res.hasAttendant) {
            showNotification({
              title: d.error,
              message: d.error_already_subscribed,
              type: 'error',
            });
            return;
          }

          const addAttendantRes = await addEventAttendant({
            eventId: eventId,
            eventAttendant: data,
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
          }
        } catch (e) {
          const message = e instanceof Error ? e.message : d.error;

          showNotification({
            title: d.error,
            message: message,
            type: 'error',
          });
        }
      });
    },
    [eventId, startProcessing, d, showNotification]
  );
}