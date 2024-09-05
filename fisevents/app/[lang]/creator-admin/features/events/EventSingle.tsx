'use client';

import dynamic from 'next/dynamic';
import { ReactElement, ReactNode, Suspense } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { EventFormSchemaType } from './hooks/useEventSingleForm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import DefaultFormField from '../../components/FormField';
import SaveButton from '../../components/SaveButton';
import EventFormActive from './components/EventFormActive';
import EventFormSlug from './components/EventFormSlug';
import { ImageUploaderProps } from '../../components/ImageUploader';

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
  imageUploaderRender: () => ReactElement<ImageUploaderProps>;
  onSubmit: (values: EventFormSchemaType) => void;
};

export default function EventSingle({
  title,
  form,
  dictionary,
  imageUploaderRender,
  onSubmit
}: EventSingleProps) {
  const endDate = form.getValues('endDate');
  const description = form.getValues('description');

  const isExpired = endDate && Date.parse(endDate) < Date.now();

  const imageUploader = imageUploaderRender();

  return (
    <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <Separator className="my-5" />
      <Form {...form}>
        <form
          onSubmit={!isExpired ? form.handleSubmit(onSubmit) : null}
          className="space-y-8"
        >
          <DefaultFormField
            form={form}
            name="title"
            label={dictionary.title}
            formComponent={Input}
            description={dictionary.descriptions.title}
          />
          <EventFormSlug
            form={form}
            label={dictionary.slug}
            description={dictionary.descriptions.slug}
            eventTitle={form.getValues('title')}
          />

          {imageUploader}

          <Suspense fallback={null}>
            <EditorComp
              markdown={description}
              onChange={(text) => form.setValue('description', text)}
            />
          </Suspense>
          <DefaultFormField
            form={form}
            name="location"
            label={dictionary.location}
            formComponent={Textarea}
            formComponentProps={{ rows: 3 }}
            description={dictionary.descriptions.location}
          />
          <DefaultFormField
            form={form}
            name="maxSubscribers"
            label={dictionary.maxSubscribers}
            formComponent={Input}
            formComponentProps={{
              type: 'number',
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                form.setValue('maxSubscribers', Number(event.target.value))
            }}
            formComponentClassName="w-20 text-center"
            description={dictionary.descriptions.maxSubscribers}
            forceNumber
          />

          <div className="flex">
            <DefaultFormField
              form={form}
              name="basicPrice"
              label={dictionary.basicPrice}
              formComponent={Input}
              formComponentProps={{ type: 'number' }}
              formComponentClassName="w-20 text-right"
              forceNumber
            />
            <DefaultFormField
              form={form}
              name="currency"
              label={dictionary.currency}
              formComponent={Input}
              formComponentProps={{ maxLength: 3 }}
              formComponentClassName="w-20"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-20">
            <DefaultFormField
              form={form}
              name="publicationStartDate"
              label={dictionary.publicationStartDate}
              description={dictionary.descriptions.publicationStartDate}
              formComponent={Input}
              formComponentProps={{
                type: 'datetime-local',
                disabled: isExpired
              }}
              formComponentClassName="w-[205px]"
            />
            <div className="mb-2">
              <EventFormActive
                form={form}
                activeText={dictionary.active}
                notActiveText={dictionary.not_active}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-1">
            <DefaultFormField
              form={form}
              name="startDate"
              label={dictionary.startDate}
              formComponent={Input}
              formComponentProps={{
                type: 'datetime-local',
                disabled: isExpired
              }}
              formComponentClassName="w-[205px]"
            />
            <DefaultFormField
              form={form}
              name="endDate"
              label={dictionary.endDate}
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
              <SaveButton className="w-full" text={dictionary.save} />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
