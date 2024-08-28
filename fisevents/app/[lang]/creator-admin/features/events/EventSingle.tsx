'use client';

import { ReactNode, Suspense } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import EventFormField from '../../components/EventFormField';
import SaveButton from '../../components/SaveButton';
import { EventFormSchemaType } from './useEventSingleForm';
import dynamic from 'next/dynamic';

const EditorComp = dynamic(
  () => import('../../components/MarkdownEditor/Editor'),
  {
    ssr: false
  }
);

export type EventSingleProps = {
  title?: string;
  form: any;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events'];
  imageUploader: ReactNode;
  onSubmit: (values: EventFormSchemaType) => void;
};

export default function EventSingle({
  title,
  form,
  dictionary,
  imageUploader: ImageUploader,
  onSubmit
}: EventSingleProps) {
  const endDate = form.getValues('endDate');
  const description = form.getValues('description');

  const isExpired = endDate && Date.parse(endDate) < Date.now();

  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-5">{title}</h1>
      <Separator className="my-5" />
      <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
        <Form {...form}>
          <form
            onSubmit={!isExpired ? form.handleSubmit(onSubmit) : null}
            className="space-y-8"
          >
            <EventFormField
              form={form}
              name="title"
              label={dictionary.labels.title}
              formComponent={Input}
              description={dictionary.descriptions.title}
            />

            {ImageUploader}

            <Suspense fallback={null}>
              <EditorComp
                markdown={description}
                onChange={(text) => form.setValue('description', text)}
              />
            </Suspense>
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
            <EventFormField
              form={form}
              name="publicationStartDate"
              label={dictionary.labels.publicationStartDate}
              description={dictionary.descriptions.publicationStartDate}
              formComponent={Input}
              formComponentProps={{
                type: 'datetime-local',
                disabled: isExpired
              }}
              formComponentClassName="w-[205px]"
            />
            <div className="flex flex-col md:flex-row gap-1">
              <EventFormField
                form={form}
                name="startDate"
                label={dictionary.labels.startDate}
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local',
                  disabled: isExpired
                }}
                formComponentClassName="w-[205px]"
              />
              <EventFormField
                form={form}
                name="endDate"
                label={dictionary.labels.endDate}
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local',
                  disabled: isExpired
                }}
                formComponentClassName="w-[205px]"
              />
            </div>

            <Separator className="my-5" />
            {!isExpired && (
              <div className="flex justify-center">
                <SaveButton className="w-full" text={dictionary.labels.save} />
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
