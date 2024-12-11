'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getDictionary } from '@/lib/i18n.utils';
import { CurrentUser } from '@/types/sanity.extended.types';
import { slugify } from '@/lib/utils';
import { use } from 'react';

export type useUserAccountFormProps = {
  userData: CurrentUser;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['account'];
};

export const formSchemaObj = z
  .object({
    name: z.string(),
    email: z.string(),
    companyName: z.string(),
    slug: z.object({
      current: z.string(),
      _type: z.literal('slug')
    }),
    www: z.string().optional(),
    logoUrl: z.string().optional(),
  });

export type UserAccountFormSchemaType = z.infer<typeof formSchemaObj>;

export function useUserAccountForm({ userData, dictionary }: useUserAccountFormProps) {

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine(
      (data) => {
        const { name } = data;

        return name.length > 5;
      },
      {
        message: dictionary.validation.name,
        path: ['name']
      }
    ).refine(
      (data) => {
        const { companyName } = data;

        return companyName.length > 5;
      },
      {
        message: dictionary.validation.companyName,
        path: ['companyName']
      }
    );


  const form = useForm<UserAccountFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name ?? '',
      email: userData.email ?? '',
      companyName: userData.companyName ?? '',
      slug: {
        current: userData?.slug?.current ?? slugify(userData?.companyName ?? userData.name ?? ''),
        _type: 'slug'
      },
      www: userData.www ?? '',
      logoUrl: userData.logoUrl ?? ''
    }
  });

  return { form, formSchema };
};