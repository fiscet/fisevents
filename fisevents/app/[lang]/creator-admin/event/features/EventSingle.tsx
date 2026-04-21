'use client';

import dynamic from 'next/dynamic';
import { ReactElement, Suspense } from 'react';
import { EventFormSchemaType } from '../hooks/useEventSingleForm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import DefaultFormField from '@/components/FormField/DefaultFormField';
import SaveButton from '../../_components/SaveButton';
import { ImageUploaderProps } from '../../_components/ImageUploader';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { isDateInPast, getMinDatetimeLocal } from '@/lib/date-utils';
import FormFieldHeader from '@/components/FormField/FormFieldHeader';
import { useForm } from 'react-hook-form';

const EditorComp = dynamic(
  () => import('../../_components/MarkdownEditor/Editor'),
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
    isExpired = isDateInPast(endDate);
  }

  const imageUploader = imageUploaderRender();

  return (
    <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {isExpired && (
          <p className="text-sm text-fe-on-surface-variant mt-1">{d.not_active}</p>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={!isExpired ? form.handleSubmit(onSubmit) : undefined}
          className="space-y-6"
        >
          {/* ── INFO BASE ── */}
          <section className="rounded-2xl border border-fe-outline-variant/20 bg-fe-surface-container-lowest p-6 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-fe-on-surface-variant">{d.section_info}</h2>
            <DefaultFormField
              form={form}
              name="title"
              label={d.title}
              formComponent={Input}
              description={d.descriptions.title}
              requiredStatus='required'
            />
            <div className="flex flex-col sm:flex-row gap-4">
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
                requiredStatus='required'
              />
              <DefaultFormField
                form={form}
                name="endDate"
                label={d.endDate}
                formComponent={Input}
                formComponentProps={{
                  type: 'datetime-local',
                  disabled: isExpired,
                  min: getMinDatetimeLocal()
                }}
                formComponentClassName="w-[215px]"
                requiredStatus='required'
              />
            </div>
          </section>

          {/* ── CONTENUTO ── */}
          <section className="rounded-2xl border border-fe-outline-variant/20 bg-fe-surface-container-lowest p-6 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-fe-on-surface-variant">{d.section_content}</h2>
            <div>
              <FormFieldHeader
                label={d.image}
                description={d.descriptions.image}
                requiredStatus='optional'
              />
              {imageUploader}
            </div>
            <div>
              <Suspense fallback={null}>
                <FormFieldHeader
                  label={d.description}
                  description={d.descriptions.description}
                  requiredStatus='optional'
                />
                <EditorComp
                  markdown={description}
                  onChange={(text) => form.setValue('description', text)}
                />
              </Suspense>
            </div>
          </section>

          {/* ── LOGISTICA ── */}
          <section className="rounded-2xl border border-fe-outline-variant/20 bg-fe-surface-container-lowest p-6 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-fe-on-surface-variant">{d.section_logistics}</h2>
            <DefaultFormField
              form={form}
              name="location"
              label={d.location}
              formComponent={Textarea}
              formComponentProps={{ rows: 2 }}
              formComponentClassName="min-h-0"
              description={d.descriptions.location}
              requiredStatus='optional'
            />
            <DefaultFormField
              form={form}
              name="talkTo"
              label={d.talk_to}
              formComponent={Textarea}
              formComponentProps={{ rows: 2 }}
              formComponentClassName="min-h-0"
              description={d.descriptions.talk_to}
              requiredStatus='optional'
            />
          </section>

          {/* ── ISCRIZIONI ── */}
          <section className="rounded-2xl border border-fe-outline-variant/20 bg-fe-surface-container-lowest p-6 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-fe-on-surface-variant">{d.section_registrations}</h2>
            <div className="flex gap-4 items-end">
              <DefaultFormField
                form={form}
                name="basicPrice"
                label={d.basicPrice}
                formComponent={Input}
                formComponentProps={{ type: 'number' }}
                formComponentClassName="w-28 text-right"
                forceNumber
                requiredStatus='optional'
              />
              <DefaultFormField
                form={form}
                name="currency"
                label={d.currency}
                formComponent={Input}
                formComponentProps={{ maxLength: 3 }}
                formComponentClassName="w-24"
                requiredStatus='optional'
              />
            </div>
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
              formComponentClassName="w-28 text-center"
              description={d.descriptions.maxSubscribers}
              forceNumber
              isAccordion={true}
              requiredStatus='optional'
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
              requiredStatus='optional'
            />
          </section>

          {!isExpired && (
            <div className="flex justify-center pt-2">
              <SaveButton label={d.save} />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
