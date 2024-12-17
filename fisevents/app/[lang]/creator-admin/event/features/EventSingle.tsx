'use client';

import dynamic from 'next/dynamic';
import { ReactElement, Suspense } from 'react';
import { EventFormSchemaType } from '../hooks/useEventSingleForm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import DefaultFormField from '@/components/FormField/DefaultFormField';
import SaveButton from '../../components/SaveButton';
import { ImageUploaderProps } from '../../components/ImageUploader';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import FormFieldHeader from '@/components/FormField/FormFieldHeader';
import { useForm } from 'react-hook-form';

const EditorComp = dynamic(
  () => import('../../components/MarkdownEditor/Editor'),
  {
    ssr: false
  }
);

export type EventSingleProps = {
  title?: string;
  form: ReturnType<typeof useForm<EventFormSchemaType>>;
  imageUploaderRender: () => ReactElement<ImageUploaderProps>;
  onSubmit: (values: EventFormSchemaType) => void;
};

export default function EventSingle({
  title,
  form,
  imageUploaderRender,
  onSubmit
}: EventSingleProps) {
  const endDate = form.getValues('endDate');
  const description = form.getValues('description');

  const { creator_admin: ca } = useDictionary();
  const { events: d } = ca;

  let isExpired = false;

  if (endDate) {
    const today = new Date().toISOString().split('T')[0] + 'T00:00';
    isExpired = Date.parse(endDate) < Date.parse(today);
  }

  const imageUploader = imageUploaderRender();

  return (
    <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <Separator className="my-5" />
      <Form {...form}>
        <form
          onSubmit={!isExpired ? form.handleSubmit(onSubmit) : undefined}
          className="space-y-8"
        >
          <DefaultFormField
            form={form}
            name="title"
            label={d.title}
            formComponent={Input}
            description={d.descriptions.title}
          />
          <div>
            <FormFieldHeader
              label={d.image}
              description={d.descriptions.image}
            />
            {imageUploader}
          </div>
          <div>
            <Suspense fallback={null}>
              <FormFieldHeader
                label={d.description}
                description={d.descriptions.description}
              />
              <EditorComp
                markdown={description}
                onChange={(text) => form.setValue('description', text)}
              />
            </Suspense>
          </div>
          <DefaultFormField
            form={form}
            name="location"
            label={d.location}
            formComponent={Textarea}
            formComponentProps={{ rows: 3 }}
            description={d.descriptions.location}
          />
          <div className="flex gap-1">
            <DefaultFormField
              form={form}
              name="basicPrice"
              label={d.basicPrice}
              formComponent={Input}
              formComponentProps={{ type: 'number' }}
              formComponentClassName="w-20 text-right"
              forceNumber
            />
            <DefaultFormField
              form={form}
              name="currency"
              label={d.currency}
              formComponent={Input}
              formComponentProps={{ maxLength: 3 }}
              formComponentClassName="w-20"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-1">
            <DefaultFormField
              form={form}
              name="startDate"
              label={d.startDate}
              formComponent={Input}
              formComponentProps={{
                type: 'datetime-local',
                disabled: isExpired
              }}
              formComponentClassName="w-[215px]"
            />
            <DefaultFormField
              form={form}
              name="endDate"
              label={d.endDate}
              formComponent={Input}
              formComponentProps={{
                type: 'datetime-local',
                disabled: isExpired,
                min: new Date().toISOString().substring(0, 16)
              }}
              formComponentClassName="w-[215px]"
            />
          </div>
          <div className="bg-slate-50 px-3">
            <DefaultFormField
              form={form}
              name="maxSubscribers"
              label={d.maxSubscribers}
              formComponent={Input}
              formComponentProps={{
                type: 'number',
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('maxSubscribers', Number(event.target.value))
              }}
              formComponentClassName="w-20 text-center"
              description={d.descriptions.maxSubscribers}
              forceNumber
              isAccordion={true}
            />

            <DefaultFormField
              form={form}
              name="publicationStartDate"
              label={d.publicationStartDate}
              description={d.descriptions.publicationStartDate}
              formComponent={Input}
              formComponentProps={{
                type: 'datetime-local',
                disabled: isExpired
              }}
              formComponentClassName="w-[215px]"
              isAccordion={true}
            />
          </div>

          <Separator className="my-5" />
          {!isExpired && (
            <div className="flex justify-center">
              <SaveButton className="w-full" text={d.save} />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
