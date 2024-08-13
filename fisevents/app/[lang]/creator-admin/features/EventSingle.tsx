'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import EventFormField from '../components/EventFormField';
import { dateToIsoString } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export type EventSingleProps = {
  eventSingleData?: OccurrenceSingle;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events'];
};

export function EventSingle({ eventSingleData, dictionary }: EventSingleProps) {
  const formSchema = z.object({
    title: z.string().min(5, {
      message: 'Username must be at least 5 characters.'
    }),
    description: z.string(),
    eventTypeCode: z.enum(['SINGLE', 'MULTIPLE']),
    location: z.string().optional(),
    maxSubscribers: z.number().optional(),
    basicPrice: z.string().optional(),
    currency: z.string().max(3).toUpperCase().optional(),
    startDate: z.string(),
    endDate: z.string(),
    publicationStartDate: z.string(),
    active: z.boolean()
  });

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
      startDate: dateToIsoString(eventSingleData?.startDate) ?? todayString,
      endDate:
        dateToIsoString(eventSingleData?.endDate) ??
        dateToIsoString(new Date(today.setDate(today.getDate() + 1))),
      publicationStartDate:
        dateToIsoString(eventSingleData?.publicationStartDate) ?? todayString,
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
      <div className="px-1 max-w-[650px] mx-auto my-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <EventFormField
              form={form}
              name="title"
              label="Title"
              formComponent={Input}
              description={'This is your event public display name.'}
            />
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
              formComponentClassName="w-20 text-right"
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
