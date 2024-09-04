'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getDictionary } from '@/lib/i18n.utils';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { FDefaultSession } from '@/types/custom.types';

export type useUserAccountFormProps = {
  session: FDefaultSession;
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

export function useUserAccountForm({ session, dictionary }: useUserAccountFormProps) {

  const [authSession, setAuthSession] = useState<Session>();

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
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      imageUrl: session?.user?.image ?? ''
    }
  });

  return { form, formSchema };
};