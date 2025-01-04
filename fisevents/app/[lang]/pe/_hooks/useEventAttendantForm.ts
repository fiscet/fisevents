'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EventAttendant } from '@/types/sanity.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { eventAttendantSchema } from '@/lib/form-schemas';

export type useEventAttendantFormProps = {
  eventAttendantData?: Partial<EventAttendant>;
};

export type AttendantFormSchemaType = z.infer<typeof eventAttendantSchema>;

export function useEventAttendantForm({ eventAttendantData }: useEventAttendantFormProps) {

  const { public: d } = useDictionary();

  const formSchema = z
    .object(eventAttendantSchema.shape)
    .refine((data) =>
      data.fullName.length > 5
      , {
        message: d.validation.fullName,
        path: ['fullName']
      }
    ).refine((data) => data.privacyAccepted === true, {
      message: d.validation.privacy_acceptance,
      path: ['privacyAccepted']
    });

  const form = useForm<AttendantFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: eventAttendantData?.fullName ?? '',
      email: eventAttendantData?.email ?? '',
      phone: eventAttendantData?.phone ?? '',
      privacyAccepted: eventAttendantData?.privacyAccepted ?? false
    }
  });

  return { form, formSchema };
};