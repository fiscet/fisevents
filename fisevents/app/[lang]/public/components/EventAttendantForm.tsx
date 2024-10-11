'use client';

import { Form } from '@/components/ui/form';
import { getDictionary } from '@/lib/i18n.utils';
import {
  AttendantFormSchemaType,
  useEventAttendantForm
} from '../hooks/useEventAttendantForm';
import { Input } from '@/components/ui/input';
import DefaultFormField from '@/components/ui/FormField';

export type EventAttendantFormProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['public'];
  onSubmit: (values: AttendantFormSchemaType) => void;
};

export default function EventAttendantForm({
  dictionary,
  onSubmit
}: EventAttendantFormProps) {
  const { form } = useEventAttendantForm({ dictionary });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DefaultFormField
            form={form}
            name="fullname"
            label={dictionary.fullname}
            formComponent={Input}
            description={dictionary.descriptions.fullname}
          />
          <DefaultFormField
            form={form}
            name="email"
            label={dictionary.email}
            formComponent={Input}
            formComponentProps={{ type: 'email' }}
            description={dictionary.descriptions.email}
          />
          <DefaultFormField
            form={form}
            name="phone"
            label={dictionary.phone}
            formComponent={Input}
            description={dictionary.descriptions.phone}
          />
        </form>
      </Form>
    </div>
  );
}
