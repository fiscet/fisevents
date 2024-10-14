'use client';

import React, { useCallback, useMemo } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { useEventAttendantForm } from '../hooks/useEventAttendantForm';
import { EventAttendant } from '@/types/sanity.types';
import { addEventAttendant, getEventSingleHasAttendant } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import EventAttendantForm from './EventAttendantForm';

export type EventAttendantContainerProps = {
  eventId: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['public'];
};

export default function EventAttendantContainer({
  eventId,
  dictionary
}: EventAttendantContainerProps) {
  const eventAttendantData = useMemo<Partial<EventAttendant>>(
    () => ({
      fullName: '',
      email: '',
      phone: ''
    }),
    []
  );

  const { form } = useEventAttendantForm({
    eventAttendantData,
    dictionary
  });

  const { showNotification } = useNotification();

  const handleAttendandSubmit = useCallback(
    async (data: Partial<EventAttendant>) => {
      const res = await getEventSingleHasAttendant({
        eventId,
        email: data.email || ''
      });

      if (res.hasAttendant) {
        showNotification({
          title: dictionary.error,
          message: dictionary.error_already_subscribed,
          type: 'error'
        });
        return;
      }

      try {
        const upd = await addEventAttendant({
          eventId: eventId,
          eventAttendant: data
        });

        if (upd) {
          showNotification({
            title: dictionary.success,
            message: dictionary.success_subscribed,
            type: 'success'
          });
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : dictionary.error;

        showNotification({
          title: dictionary.error,
          message: message,
          type: 'error'
        });
      }
    },
    []
  );

  return (
    <EventAttendantForm
      form={form}
      dictionary={dictionary}
      onSubmit={handleAttendandSubmit}
    />
  );
}
