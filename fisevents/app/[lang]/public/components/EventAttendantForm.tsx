'use client';

import { Form } from '@/components/ui/form';
import { getDictionary } from '@/lib/i18n.utils';
import {
  AttendantFormSchemaType,
  useEventAttendantForm
} from '../hooks/useEventAttendantForm';
import { Input } from '@/components/ui/input';
import DefaultFormField from '@/components/FormField';
import { EventAttendant } from '@/types/sanity.types';
import SaveButton from '../../creator-admin/components/SaveButton';

export type EventAttendantFormProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['public'];
  onSubmit?: (values: AttendantFormSchemaType) => void;
};

export default function EventAttendantForm({
  dictionary,
  onSubmit
}: EventAttendantFormProps) {
  const eventAttendantData = {
    fullName: sessionStorage.getItem('fullName') ?? '',
    email: sessionStorage.getItem('email') ?? '',
    phone: sessionStorage.getItem('phone') ?? ''
  };

  const { form } = useEventAttendantForm({
    eventAttendantData,
    dictionary
  });

  function handleAttendandSubmit(data: Partial<EventAttendant>) {
    console.log('handleAttendandSubmit', data);
  }

  return (
    <div className="pb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAttendandSubmit)}
          className="space-y-8"
        >
          <DefaultFormField
            form={form}
            name="fullName"
            label={dictionary.fullname}
            formComponent={Input}
            description={dictionary.descriptions.fullname}
          />
          <DefaultFormField
            form={form}
            name="email"
            label={dictionary.email}
            formComponent={Input}
            description={dictionary.descriptions.email}
          />
          <DefaultFormField
            form={form}
            name="phone"
            label={dictionary.phone}
            formComponent={Input}
            description={dictionary.descriptions.phone}
          />
          <div className="flex justify-center">
            <SaveButton className="w-full" text={dictionary.subscribe_button} />{' '}
          </div>
        </form>
      </Form>
    </div>
  );
}
