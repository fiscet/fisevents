'use client';

import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DefaultFormField from '@/components/FormField/DefaultFormField';
import SaveButton from '../../creator-admin/_components/SaveButton';
import { AttendantFormSchemaType } from '../_hooks/useEventAttendantForm';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

export type EventAttendantProps = {
  form: ReturnType<typeof useForm<AttendantFormSchemaType>>;
  onSubmit: (data: AttendantFormSchemaType) => void;
};

const MemoizedDefaultFormField = React.memo(DefaultFormField);

const EventAttendantComponent = ({ form, onSubmit }: EventAttendantProps) => {
  const { public: d } = useDictionary();

  return (
    <div className="pb-10">
      <h1 className="text-2xl font-bold text-center mt-5">
        {d.subscribe_title}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <MemoizedDefaultFormField
            form={form}
            name="fullName"
            label={d.fullname}
            formComponent={Input}
            description={d.descriptions.fullname}
          />
          <MemoizedDefaultFormField
            form={form}
            name="email"
            label={d.email}
            formComponent={Input}
            description={d.descriptions.email}
          />
          <MemoizedDefaultFormField
            form={form}
            name="phone"
            label={d.phone}
            formComponent={Input}
            description={d.descriptions.phone}
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
                    {d.privacy_acceptance}
                  </FormLabel>
                </div>
                <FormDescription className="text-sm text-muted-foreground">
                  {d.descriptions.privacy_acceptance}
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <SaveButton className="w-full" text={d.subscribe_button} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventAttendantComponent;
