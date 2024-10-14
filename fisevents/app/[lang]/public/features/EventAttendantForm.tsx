'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DefaultFormField from '@/components/FormField';
import SaveButton from '../../creator-admin/components/SaveButton';
import { AttendantFormSchemaType } from '../hooks/useEventAttendantForm';

export type EventAttendantProps = {
  form: any;
  dictionary: Record<string, any>;
  onSubmit: (data: AttendantFormSchemaType) => void;
};

const MemoizedDefaultFormField = React.memo(DefaultFormField);

const EventAttendantComponent = ({
  form,
  dictionary,
  onSubmit
}: EventAttendantProps) => {
  return (
    <div className="pb-10">
      <h1 className="text-2xl font-bold text-center mt-5">
        {dictionary.subscribe_title}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <MemoizedDefaultFormField
            form={form}
            name="fullName"
            label={dictionary.fullname}
            formComponent={Input}
            description={dictionary.descriptions.fullname}
          />
          <MemoizedDefaultFormField
            form={form}
            name="email"
            label={dictionary.email}
            formComponent={Input}
            description={dictionary.descriptions.email}
          />
          <MemoizedDefaultFormField
            form={form}
            name="phone"
            label={dictionary.phone}
            formComponent={Input}
            description={dictionary.descriptions.phone}
          />
          <div className="flex justify-center">
            <SaveButton className="w-full" text={dictionary.subscribe_button} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventAttendantComponent;
