'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { pickerDateToIsoString, slugify } from '@/lib/utils';
import { safeParseDate, validateDateRange } from '@/lib/date-utils';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { singleEventSchema } from '@/lib/form-schemas';

export type useEventSingleFormProps = {
  eventSingleData?: OccurrenceSingle;
  isDuplicate?: boolean;
};


export type EventFormSchemaType = z.infer<typeof singleEventSchema>;

export function useEventSingleForm({ eventSingleData, isDuplicate = false }: useEventSingleFormProps) {

  const { creator_admin: ca } = useDictionary();
  const { events: d } = ca;

  const formSchema = z
    .object(singleEventSchema.shape)
    .refine(
      (data) => {
        const { publicationStartDate, startDate } = data;

        if (!publicationStartDate) return true;

        const pubDate = safeParseDate(publicationStartDate);
        const startDateObj = safeParseDate(startDate);

        if (!pubDate || !startDateObj) return false;

        return pubDate <= startDateObj;
      },
      {
        message: d.validation.publicationStartDateAndStartDate,
        path: ['publicationStartDate']
      }
    )
    .refine(
      (data) => {
        const { _id, publicationStartDate } = data;

        if (_id || !publicationStartDate) return true;

        const minutesTolerance = 5;
        const pubDate = safeParseDate(publicationStartDate);

        if (!pubDate) return false;

        const minDate = new Date(Date.now() - minutesTolerance * 60 * 1000);
        return pubDate >= minDate;
      },
      {
        message: d.validation.publicationStartDateAndNow,
        path: ['publicationStartDate']
      }
    )
    .refine(
      (data) => {
        const { startDate, endDate } = data;

        return validateDateRange(startDate, endDate);
      },
      {
        message: d.validation.startDate,
        path: ['startDate']
      }
    ).refine((data) =>
      data.title.length > 5
      , {
        message: d.validation.title,
        path: ['title']
      }
    );

  const today = new Date();
  const todayString = pickerDateToIsoString(today);

  const form = useForm<EventFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: isDuplicate ? '' : (eventSingleData?._id ?? ''),
      title: isDuplicate
        ? `${d.duplicate_prefix}${eventSingleData?.title ?? ''}`
        : (eventSingleData?.title ?? ''),
      slug: {
        current: isDuplicate ? '' : (eventSingleData?.slug?.current ?? slugify(eventSingleData?.title ?? '')),
        _type: 'slug'
      },
      publicSlug: isDuplicate ? '' : (eventSingleData?.publicSlug ?? ''),
      description: eventSingleData?.description ?? '',
      location: eventSingleData?.location ?? '',
      talkTo: eventSingleData?.talkTo ?? '',
      maxSubscribers: eventSingleData?.maxSubscribers ?? undefined,
      basicPrice:
        eventSingleData?.basicPrice?.toString().replace(',', '.') ?? '0',
      currency: eventSingleData?.currency ?? '',
      publicationStartDate: isDuplicate ? undefined : (
        pickerDateToIsoString(eventSingleData?.publicationStartDate) ?? undefined
      ),
      startDate: isDuplicate
        ? todayString
        : (pickerDateToIsoString(eventSingleData?.startDate) ?? todayString),
      endDate: isDuplicate
        ? pickerDateToIsoString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        : (pickerDateToIsoString(eventSingleData?.endDate) ??
           pickerDateToIsoString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))),
      active: isDuplicate ? true : (eventSingleData?.active ?? true),
    }
  });

  return { form, formSchema };
};