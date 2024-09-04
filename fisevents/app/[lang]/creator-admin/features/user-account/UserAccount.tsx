'use client';

import { ReactNode } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { UserAccountFormSchemaType } from './hooks/useUserAccountForm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import DefaultFormField from '../../components/FormField';
import SaveButton from '../../components/SaveButton';

export type UserAccountProps = {
  form: any;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['account'];
  imageUploader: ReactNode;
  onSubmit: (values: UserAccountFormSchemaType) => void;
};

export default function UserAccount({
  form,
  dictionary,
  imageUploader: ImageUploader,
  onSubmit
}: UserAccountProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-5">
        {form.getValues('name')}
      </h1>
      <div className="text-center py-2">{form.getValues('email')}</div>
      <Separator className="my-5" />
      <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DefaultFormField
              form={form}
              name="name"
              label={dictionary.labels.name}
              formComponent={Input}
              description={dictionary.descriptions.name}
            />

            {ImageUploader}
            <Separator className="my-5" />
            <div className="flex justify-center">
              <SaveButton className="w-full" text={dictionary.labels.save} />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
