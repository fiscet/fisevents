'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EventAttendant } from '@/types/sanity.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type useEventAttendantFormProps = {
  eventAttendantData?: Partial<EventAttendant>;
};

export const formSchemaObj = z
  .object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string()
  });

export type AttendantFormSchemaType = z.infer<typeof formSchemaObj>;

export function useEventAttendantForm({ eventAttendantData }: useEventAttendantFormProps) {

  const { public: d } = useDictionary();

  const formSchema = z
    .object(formSchemaObj.shape)
    .refine((data) =>
      data.fullName.length > 5
      , {
        message: d.validation.fullName,
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