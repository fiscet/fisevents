'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DefaultFormField from '@/components/FormField/DefaultFormField';
import SaveButton from '../../creator-admin/components/SaveButton';
import { AttendantFormSchemaType } from '../hooks/useEventAttendantForm';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventAttendantProps = {
  form: any;
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
          <div className="flex justify-center">
            <SaveButton className="w-full" text={d.subscribe_button} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventAttendantComponent;
