'use client';

import { ReactElement, useEffect } from 'react';
import { UserAccountFormSchemaType } from '../hooks/useUserAccountForm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import DefaultFormField from '@/components/FormField/FormField';
import SaveButton from '../../components/SaveButton';
import { ImageUploaderProps } from '../../components/ImageUploader';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { useForm } from 'react-hook-form';

export type UserAccountProps = {
  form: ReturnType<typeof useForm<UserAccountFormSchemaType>>;
  imageUploaderRender: () => ReactElement<ImageUploaderProps>;
  onSubmit: (values: UserAccountFormSchemaType) => void;
};

export default function UserAccount({
  form,
  imageUploaderRender,
  onSubmit
}: UserAccountProps) {
  const imageUploader = imageUploaderRender();

  const { creator_admin: ca } = useDictionary();
  const { account: a, common: c } = ca;

  useEffect(() => {
    if (!form.getValues('companyName')) {
      form.setFocus('companyName');
      form.trigger('companyName');
    }
  }, []);

  return (
    <div className="px-1 max-w-[650px] mx-auto mb-10">
      <h1 className="text-2xl font-bold text-center">
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
              label={a.name}
              formComponent={Input}
              description={a.descriptions.name}
            />
            <DefaultFormField
              form={form}
              name="companyName"
              label={a.companyName}
              formComponent={Input}
              description={a.descriptions.companyName}
            />

            {imageUploader}

            <DefaultFormField
              form={form}
              name="www"
              label={a.www}
              formComponent={Input}
              description={a.descriptions.www}
            />

            <Separator className="my-5" />
            <div className="flex justify-center">
              <SaveButton className="w-full" text={c.save} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
