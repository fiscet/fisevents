'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CurrentUser } from '@/types/sanity.extended.types';
import { checkIsValidUrl, slugify } from '@/lib/utils';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type useUserAccountFormProps = {
  userData: CurrentUser;
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

export function useUserAccountForm({ userData }: useUserAccountFormProps) {
  const { creator_admin: ca } = useDictionary();
  const { account: d } = ca;

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine(
      (data) => {
        const { name } = data;

        return name.length > 5;
      },
      {
        message: d.validation.name,
        path: ['name']
      }
    ).refine(
      (data) => {
        const { companyName } = data;

        return companyName.length > 5;
      },
      {
        message: d.validation.companyName,
        path: ['companyName']
      }
    ).refine((data) => {
      const { www } = data;

      if(www && !checkIsValidUrl(www)) return false;

      return true;
    },
    {
      message: d.validation.www,
      path: ['www']
    });

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
    },
    mode: 'all',
    shouldFocusError: true
  });

  return { form, formSchema };
};