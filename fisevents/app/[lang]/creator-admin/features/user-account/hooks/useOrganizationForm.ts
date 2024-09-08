'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getDictionary } from '@/lib/i18n.utils';
import { CurrentOrganization } from '@/types/sanity.extended.types';

export type useOrganizationFormProps = {
  organizationData: CurrentOrganization;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['organization'];
};

export const formSchemaObj = z
  .object({
    companyName: z.string().optional(),
    www: z.string().optional(),
    imageUrl: z.string().optional(),
  });

export type OrganizationFormSchemaType = z.infer<typeof formSchemaObj>;

export function useOrganizationForm({ organizationData, dictionary }: useOrganizationFormProps) {

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine(
      (data) => {
        const { companyName } = data;

        return companyName && companyName?.length > 5;
      },
      {
        message: dictionary.validation.companyName,
        path: ['companyName']
      }
    );

  const form = useForm<OrganizationFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: organizationData.companyName,
      www: organizationData.www,
    }
  });

  return { form, formSchema };
};