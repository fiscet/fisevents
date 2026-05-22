'use client';

import { useCallback } from 'react';
import { subscribeToEvent } from '@/lib/actions';
import { EventAttendant } from '@/types/sanity.types';
import { useNotification } from '@/components/Notification/useNotification';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import type { Locale } from '@/lib/i18n';
import type { PublicOccurrenceSingle } from '@/types/sanity.extended.types';
import {
  customFieldsValuesToArray,
  type CustomFieldDefInput,
} from '@/lib/custom-fields';
import type { AttendantFormSchemaType } from './useEventAttendantForm';

type ManageSubscriptionProps = {
  eventId: string;
  lang: Locale;
  eventData: PublicOccurrenceSingle;
  eventSlug: string;
  customFields?: CustomFieldDefInput[];
  startProcessing: (callback: () => void) => void;
  setIsSubscribed: (value: boolean) => void;
};

export function useManageSubscription({
  eventId,
  lang,
  eventData,
  eventSlug,
  customFields,
  startProcessing,
  setIsSubscribed,
}: ManageSubscriptionProps) {
  const { showNotification } = useNotification();
  const { public: d } = useDictionary();

  return useCallback(
    async (data: AttendantFormSchemaType) => {
      startProcessing(async () => {
        try {
          const { customFields: customFieldsValues, ...attendantBase } = data;
          const eventAttendant: Partial<EventAttendant> = {
            ...attendantBase,
            customFieldValues: customFieldsValuesToArray(
              customFields,
              customFieldsValues
            ) as EventAttendant['customFieldValues'],
          };

          const result = await subscribeToEvent({
            eventId,
            eventAttendant,
            lang,
            emailData: {
              eventTitle: eventData.title ?? '',
              description: eventData.description ?? undefined,
              location: eventData.location ?? undefined,
              talkTo: eventData.talkTo ?? undefined,
              price: eventData.price,
              startDate: eventData.startDate ?? undefined,
              endDate: eventData.endDate ?? undefined,
              companyName: eventData.companyName,
              organizationSlug: eventData.organizationSlug,
              eventSlug,
              organizerEmail: eventData.organizerEmail,
            },
          });

          if (result) {
            showNotification({
              title: d.success,
              message: d.success_subscribed,
              type: 'success',
            });
            setIsSubscribed(true);
          }
        } catch (e) {
          const message = e instanceof Error
            ? d.errors[e.message as keyof typeof d.errors]
            : d.errors.generic;

          showNotification({
            title: d.errors.default_title,
            message: message,
            type: 'error',
          });
        }
      });
    },
    [eventId, lang, eventData, eventSlug, customFields, startProcessing, d, showNotification, setIsSubscribed]
  );
}
