'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { dateToIsoString } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import EventFormField from '../components/EventFormField';
import SaveButton from '../components/SaveButton';

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
        message: 'Username must be at least 5 characters.'
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
        message: 'The publication date must be before the event start date',
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
        message: 'The start date must be before the event end date',
        path: ['startDate']
      }
    );

  const today = new Date();
  const todayString = dateToIsoString(today);

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
        dateToIsoString(eventSingleData?.publicationStartDate) ?? todayString,
      startDate: dateToIsoString(eventSingleData?.startDate) ?? todayString,
      endDate:
        dateToIsoString(eventSingleData?.endDate) ??
        dateToIsoString(new Date(today.setDate(today.getDate() + 1))),
      active: eventSingleData?.active ?? true
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
              label="Title"
              formComponent={Input}
              description={'This is your event public display name.'}
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
              label="Description"
              formComponent={Textarea}
              formComponentProps={{ rows: 10 }}
              description={
                'Give your users details about this event, e.g. who it is for, what benefits it provides, what the teaching plan is, etc.'
              }
            />
            <EventFormField
              form={form}
              name="location"
              label="Location"
              formComponent={Textarea}
              formComponentProps={{ rows: 3 }}
              description={
                'Where will the event be held? If it is a venue, please provide directions to get there'
              }
            />
            <EventFormField
              form={form}
              name="maxSubscribers"
              label="Max Subscribers"
              formComponent={Input}
              formComponentProps={{ type: 'number' }}
              formComponentClassName="w-20 text-center"
              description={
                'If it is a limited number, indicate the maximum number, otherwise write 0'
              }
              forceNumber
            />

            <div className="flex gap-1">
              <EventFormField
                form={form}
                name="basicPrice"
                label="Price"
                formComponent={Input}
                formComponentProps={{ type: 'number' }}
                formComponentClassName="w-20 text-right"
                forceNumber
              />
              <EventFormField
                form={form}
                name="currency"
                label="Currency"
                formComponent={Input}
                formComponentProps={{ maxLength: 3 }}
                formComponentClassName="w-20"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-1">
              <EventFormField
                form={form}
                name="publicationStartDate"
                label="Publication Start Date"
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
                label="Start Date"
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local'
                }}
              />
              <EventFormField
                form={form}
                name="endDate"
                label="End Date"
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local'
                }}
              />
            </div>
            <Separator className="my-5" />
            <div className="flex justify-center">
              <SaveButton className="w-full" text="Save" />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
