import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { pickerDateToIsoString } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';

export type useEventSingleFormProps = {
  eventSingleData?: OccurrenceSingle;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events'];
};

export const formSchemaObj = z
  .object({
    title: z.string(),
    description: z.string(),
    eventTypeCode: z.enum(['SINGLE', 'MULTIPLE']),
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

export function useEventSingleForm({ eventSingleData, dictionary }: useEventSingleFormProps) {

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine(
      (data) => {
        const { publicationStartDate, startDate } = data;

        const tsPublicationStartDate = Date.parse(publicationStartDate);
        const tsStartDate = Date.parse(startDate);

        return tsPublicationStartDate < tsStartDate;
      },
      {
        message: dictionary.validation.publicationStartDate,
        path: ['publicationStartDate']
      }
    )
    .refine(
      (data) => {
        const { startDate, endDate } = data;

        const tsStartDate = Date.parse(startDate);
        const tsEndDate = Date.parse(endDate);

        return tsStartDate < tsEndDate;
      },
      {
        message: dictionary.validation.startDate,
        path: ['startDate']
      }
    ).refine((data) =>
      data.title.length > 5
      , {
        message: dictionary.validation.title,
        path: ['title']
      }
    );


  const today = new Date();
  const todayString = pickerDateToIsoString(today);

  const form = useForm<EventFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: eventSingleData?.title ?? '',
      description: eventSingleData?.description ?? '',
      eventTypeCode:
        (eventSingleData?.eventTypeCode as 'SINGLE' | 'MULTIPLE') ?? 'SINGLE',
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
        pickerDateToIsoString(new Date(today.setDate(today.getDate() + 1))),
      active: eventSingleData?.active ?? true
    }
  });

  return { form, formSchema };
};