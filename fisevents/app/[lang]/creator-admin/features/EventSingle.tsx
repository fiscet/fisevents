'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { pickerDateToIsoString, toIsoString } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import EventFormField from '../components/EventFormField';
import SaveButton from '../components/SaveButton';
import { sanityClient } from '@/lib/sanity';
import path from 'path';
import { updateEvent } from '@/lib/actions';
import { Occurrence } from '@/types/sanity.types';

export type EventSingleProps = {
  eventSingleData?: OccurrenceSingle;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events'];
};

export function EventSingle({ eventSingleData, dictionary }: EventSingleProps) {
  const formSchema = z
    .object({
      title: z.string().min(5, {
        message: dictionary.validation.title
      }),
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
    })
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
    );

  const today = new Date();
  const todayString = pickerDateToIsoString(today);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: eventSingleData?.title ?? '',
      description: eventSingleData?.description ?? '',
      eventTypeCode:
        (eventSingleData?.eventTypeCode as 'SINGLE' | 'MULTIPLE') ?? 'SINGLE',
      location: eventSingleData?.location ?? '',
      maxSubscribers: eventSingleData?.maxSubscribers ?? 0,
      basicPrice: eventSingleData?.basicPrice?.toString() ?? '0',
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    values.publicationStartDate = toIsoString(
      new Date(values.publicationStartDate)
    );
    values.startDate = toIsoString(new Date(values.startDate));
    values.endDate = toIsoString(new Date(values.endDate));

    updateEvent({
      id: eventSingleData!._id!,
      data: values as Partial<Occurrence>
    });

    // const patch = await sanityClient
    //   .patch(eventSingleData!._id!)
    //   .set({ title: values.title })
    //   .commit();

    // console.log({ path });
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-5">
        {eventSingleData?.title!}
      </h1>
      <Separator className="my-5" />
      <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <EventFormField
              form={form}
              name="title"
              label={dictionary.labels.title}
              formComponent={Input}
              description={dictionary.descriptions.title}
            />
            {eventSingleData?.pageImage.url && (
              <Image
                src={eventSingleData.pageImage.url}
                alt="Logo"
                width="400"
                height="400"
                className="mx-auto"
              />
            )}
            <EventFormField
              form={form}
              name="description"
              label={dictionary.labels.description}
              formComponent={Textarea}
              formComponentProps={{ rows: 10 }}
              description={dictionary.descriptions.description}
            />
            <EventFormField
              form={form}
              name="location"
              label={dictionary.labels.location}
              formComponent={Textarea}
              formComponentProps={{ rows: 3 }}
              description={dictionary.descriptions.location}
            />
            <EventFormField
              form={form}
              name="maxSubscribers"
              label={dictionary.labels.maxSubscribers}
              formComponent={Input}
              formComponentProps={{ type: 'number' }}
              formComponentClassName="w-20 text-center"
              description={dictionary.descriptions.maxSubscribers}
              forceNumber
            />

            <div className="flex gap-1">
              <EventFormField
                form={form}
                name="basicPrice"
                label={dictionary.labels.basicPrice}
                formComponent={Input}
                formComponentProps={{ type: 'number' }}
                formComponentClassName="w-20 text-right"
                forceNumber
              />
              <EventFormField
                form={form}
                name="currency"
                label={dictionary.labels.currency}
                formComponent={Input}
                formComponentProps={{ maxLength: 3 }}
                formComponentClassName="w-20"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-1">
              <EventFormField
                form={form}
                name="publicationStartDate"
                label={dictionary.labels.publicationStartDate}
                description={dictionary.descriptions.publicationStartDate}
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local'
                }}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-1">
              <EventFormField
                form={form}
                name="startDate"
                label={dictionary.labels.startDate}
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local'
                }}
              />
              <EventFormField
                form={form}
                name="endDate"
                label={dictionary.labels.endDate}
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local'
                }}
              />
            </div>
            <Separator className="my-5" />
            <div className="flex justify-center">
              <SaveButton className="w-full" text={dictionary.labels.save} />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
