'use client';

import { useDictionary } from '@/app/contexts/DictionaryContext';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DefaultFormField from '@/components/FormField/DefaultFormField';
import SaveButton from '../../creator-admin/_components/SaveButton';
import { AttendantFormSchemaType } from '../_hooks/useEventAttendantForm';
import { Switch } from '@/components/ui/switch';
import CustomFieldsRenderer from '@/components/CustomFields/CustomFieldsRenderer';
import type { CustomFieldDefInput } from '@/lib/custom-fields';
import { MdOutlineErrorOutline } from 'react-icons/md';

export type EventAttendantProps = {
  form: ReturnType<typeof useForm<AttendantFormSchemaType>>;
  onSubmit: (data: AttendantFormSchemaType) => void;
  customFields?: CustomFieldDefInput[];
  isFull?: boolean;
};

const EventAttendantComponent = ({ form, onSubmit, customFields, isFull = false }: EventAttendantProps) => {
  const { public: d } = useDictionary();

  return (
    <div className="pb-10 mt-8 pt-8 border-t border-fe-outline-variant/20" id="event-attendant-form-container">
      <h2 className="text-xl font-semibold text-center mb-6">
        {d.subscribe_title}
      </h2>
      {isFull && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 mb-6">
          <div className="flex items-center justify-center gap-2 text-orange-700 font-bold text-base">
            <MdOutlineErrorOutline className="w-5 h-5 shrink-0" />
            <span>{d.waitlist_full_title}</span>
          </div>
          <p className="text-sm text-center text-fe-on-surface-variant mt-1.5">
            {d.waitlist_full_notice}
          </p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DefaultFormField
            form={form}
            name="fullName"
            label={d.fullname}
            formComponent={Input}
            description={d.descriptions.fullname}
            requiredStatus='required'
          />
          <DefaultFormField
            form={form}
            name="email"
            label={d.email}
            formComponent={Input}
            description={d.descriptions.email}
            requiredStatus='required'
          />
          <DefaultFormField
            form={form}
            name="phone"
            label={d.phone}
            formComponent={Input}
            description={d.descriptions.phone}
            requiredStatus='optional-with-text'
          />
          <CustomFieldsRenderer
            form={form}
            customFields={customFields}
            selectPlaceholder={d.custom_select_placeholder}
          />
          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 items-center justify-end md:justify-between md:mb-5">
                <div className='w-full flex  items-center gap-2'>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel style={{ margin: 0 }}>
                    {d.privacy_acceptance} *
                  </FormLabel>
                </div>
                <FormDescription className="text-sm text-muted-foreground">
                  {d.descriptions.privacy_acceptance}
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <SaveButton label={isFull ? d.waitlist_button : d.subscribe_button} isEnabled={form.formState.isValid} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventAttendantComponent;
