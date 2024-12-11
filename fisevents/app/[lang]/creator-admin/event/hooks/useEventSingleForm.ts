'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { pickerDateToIsoString, slugify } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type useEventSingleFormProps = {
  eventSingleData?: OccurrenceSingle;
};

export const formSchemaObj = z
  .object({
    _id: z.string(),
    title: z.string(),
    slug: z.object({
      current: z.string(),
      _type: z.literal('slug')
    }),
    description: z.string(),
    location: z.string().optional(),
    maxSubscribers: z.number().optional(),
    basicPrice: z.string().optional(),
    currency: z.string().max(3).toUpperCase().optional(),
    publicationStartDate: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    active: z.boolean()
  });

export type EventFormSchemaType = z.infer<typeof formSchemaObj>;

export function useEventSingleForm({ eventSingleData }: useEventSingleFormProps) {

  const { creator_admin: ca } = useDictionary();
  const { events: d } = ca;

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine(
      (data) => {
        const { publicationStartDate, startDate } = data;

        const tsPublicationStartDate = Date.parse(publicationStartDate);
        const tsStartDate = Date.parse(startDate);

        return tsPublicationStartDate <= tsStartDate;
      },
      {
        message: d.validation.publicationStartDateAndStartDate,
        path: ['publicationStartDate']
      }
    )
    .refine(
      (data) => {
        const { _id, publicationStartDate } = data;

        if (_id) return true;

        const tsPublicationStartDate = Date.parse(publicationStartDate);

        return tsPublicationStartDate >= Date.now();
      },
      {
        message: d.validation.publicationStartDateAndNow,
        path: ['publicationStartDate']
      }
    )
    .refine(
      (data) => {
        const { startDate, endDate } = data;

        const tsStartDate = Date.parse(startDate);
        const tsEndDate = Date.parse(endDate);

        return tsStartDate <= tsEndDate;
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
    ).refine((data) =>
      data.slug.current.length > 5
      , {
        message: d.validation.slug,
        path: ['slug.current']
      }
    );

  const today = new Date();
  const todayString = pickerDateToIsoString(today);

  const form = useForm<EventFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: eventSingleData?._id ?? '',
      title: eventSingleData?.title ?? '',
      slug: {
        current: eventSingleData?.slug?.current ?? slugify(eventSingleData?.title ?? ''),
        _type: 'slug'
      },
      description: eventSingleData?.description ?? '',
      location: eventSingleData?.location ?? '',
      maxSubscribers: eventSingleData?.maxSubscribers ?? 0,
      basicPrice:
        eventSingleData?.basicPrice?.toString().replace(',', '.') ?? '0',
      currency: eventSingleData?.currency ?? '',
      publicationStartDate:
        pickerDateToIsoString(eventSingleData?.publicationStartDate) ??
        todayString,
      startDate:
        pickerDateToIsoString(eventSingleData?.startDate) ?? todayString,
      endDate:
        pickerDateToIsoString(eventSingleData?.endDate) ??
        pickerDateToIsoString(new Date(today.setDate(today.getDate() + 7))),
      active: eventSingleData?.active ?? true
    }
  });

  return { form, formSchema };
};