'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getDictionary } from '@/lib/i18n.utils';
import { CurrentUser } from '@/types/sanity.extended.types';

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
    imageUrl: z.string(),
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
    );


  const form = useForm<UserAccountFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name ?? '',
      email: userData.email ?? '',
      imageUrl: userData.image ?? ''
    }
  });

  return { form, formSchema };
};