'use client';

import { useCallback } from 'react';
import { addEventAttendant, getEventSingleHasAttendantById } from '@/lib/actions';
import { sendMail } from '@/lib/send-mail';
import { EventAttendant } from '@/types/sanity.types';
import { useNotification } from '@/components/Notification/useNotification';

type ManageSubscriptionProps = {
  eventId: string;
  startProcessing: (callback: () => void) => void;
  dictionary: {
    error: string;
    error_already_subscribed: string;
    success: string;
    success_subscribed: string;
  };
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
  dictionary,
  setIsSubscribed,
  prepareEmailContent,
}: ManageSubscriptionProps) {
  const { showNotification } = useNotification();

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
              title: dictionary.error,
              message: dictionary.error_already_subscribed,
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
              title: dictionary.success,
              message: dictionary.success_subscribed,
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
          const message = e instanceof Error ? e.message : dictionary.error;

          showNotification({
            title: dictionary.error,
            message: message,
            type: 'error',
          });
        }
      });
    },
    [eventId, startProcessing, dictionary, showNotification]
  );
}