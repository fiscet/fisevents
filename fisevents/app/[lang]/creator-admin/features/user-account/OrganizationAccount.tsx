'use client';

import { ReactElement } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { OrganizationFormSchemaType } from './hooks/useOrganizationForm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import DefaultFormField from '@/components/FormField';
import SaveButton from '../../components/SaveButton';
import { ImageUploaderProps } from '../../components/ImageUploader';
import FormSlug from '../../components/FormSlug';

export type OrganizatioAccountProps = {
  form: any;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['organization'] &
    Awaited<ReturnType<typeof getDictionary>>['creator_admin']['common'];
  imageUploaderRender: () => ReactElement<ImageUploaderProps>;
  onSubmit: (values: OrganizationFormSchemaType) => void;
};

export default function OrganizatioAccount({
  form,
  dictionary,
  imageUploaderRender,
  onSubmit
}: OrganizatioAccountProps) {
  const imageUploader = imageUploaderRender();

  return (
    <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
      <h1 className="text-2xl font-bold text-center mt-5">
        {form.getValues('companyName')}
      </h1>
      <div className="text-center py-2">{form.getValues('www')}</div>
      <Separator className="my-5" />
      <div className="px-1 max-w-[650px] mx-auto mt-5 mb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DefaultFormField
              form={form}
              name="companyName"
              label={dictionary.companyName}
              formComponent={Input}
              description={dictionary.descriptions.companyName}
            />
            <FormSlug
              form={form}
              label={dictionary.slug}
              description={dictionary.descriptions.slug}
              sourceItem={form.getValues('companyName')}
            />
            <DefaultFormField
              form={form}
              name="www"
              label={dictionary.www}
              formComponent={Input}
              description={dictionary.descriptions.www}
            />

            {imageUploader}

            <Separator className="my-5" />
            <div className="flex justify-center">
              <SaveButton className="w-full" text={dictionary.save} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
