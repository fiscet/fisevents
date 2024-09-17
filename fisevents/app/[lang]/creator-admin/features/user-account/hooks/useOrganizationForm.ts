'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getDictionary } from '@/lib/i18n.utils';
import { CurrentOrganization } from '@/types/sanity.extended.types';
import { slugify } from '@/lib/utils';

export type useOrganizationFormProps = {
  organizationData: CurrentOrganization;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['organization'];
};

export const formSchemaObj = z
  .object({
    companyName: z.string().optional(),
    slug: z.object({
      current: z.string(),
      _type: z.literal('slug')
    }),
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
    ).refine((data) =>
      data.slug.current.length > 5
      , {
        message: dictionary.validation.slug,
        path: ['slug.current']
      }
    );;

  const form = useForm<OrganizationFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: organizationData.companyName,
      slug: {
        current: organizationData?.slug?.current ?? slugify(organizationData?.companyName ?? ''),
        _type: 'slug'
      },
      www: organizationData.www,
    }
  });

  return { form, formSchema };
};