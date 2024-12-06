'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getDictionary } from '@/lib/i18n.utils';
import { EventAttendant } from '@/types/sanity.types';

export type useEventAttendantFormProps = {
  eventAttendantData?: Partial<EventAttendant>;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['public'];
};

export const formSchemaObj = z
  .object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string()
  });

export type AttendantFormSchemaType = z.infer<typeof formSchemaObj>;

export function useEventAttendantForm({ eventAttendantData, dictionary }: useEventAttendantFormProps) {

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine((data) =>
      data.fullName.length > 5
      , {
        message: dictionary.validation.fullName,
        path: ['fullName']
      }
    );

  const form = useForm<AttendantFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: eventAttendantData?.fullName ?? '',
      email: eventAttendantData?.email ?? '',
      phone: eventAttendantData?.phone ?? ''
    }
  });

  return { form, formSchema };
};