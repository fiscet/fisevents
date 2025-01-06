'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CurrentUser } from '@/types/sanity.extended.types';
import { checkIsValidUrl, slugify } from '@/lib/utils';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { userAccountSchema } from '@/lib/form-schemas';

export type useUserAccountFormProps = {
  userData: CurrentUser;
};


export type UserAccountFormSchemaType = z.infer<typeof userAccountSchema>;

export function useUserAccountForm({ userData }: useUserAccountFormProps) {
  const { creator_admin: ca } = useDictionary();
  const { account: d } = ca;

  const formSchema = z
    .object(userAccountSchema.shape)
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
      if (data.www && (!data.www.startsWith('http://') && !data.www.startsWith('https://'))) {
        data.www = 'https://' + data.www;
      }

      const { www } = data;

      if (www && !checkIsValidUrl(www)) return false;

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