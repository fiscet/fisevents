'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EventAttendant } from '@/types/sanity.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { eventAttendantSchema } from '@/lib/form-schemas';
import {
  buildCustomFieldsSchema,
  getCustomFieldsDefaults,
  type CustomFieldDefInput,
  type CustomFieldsFormValues,
} from '@/lib/custom-fields';

export type useEventAttendantFormProps = {
  eventAttendantData?: Partial<EventAttendant>;
  customFields?: CustomFieldDefInput[];
};

export type AttendantFormSchemaType = z.infer<typeof eventAttendantSchema> & {
  customFields: CustomFieldsFormValues;
};

export function useEventAttendantForm({
  eventAttendantData,
  customFields,
}: useEventAttendantFormProps) {

  const { public: d } = useDictionary();

  const customFieldsSchema = buildCustomFieldsSchema(customFields, {
    required: d.validation.custom_required,
    invalidNumber: d.validation.custom_invalid_number,
  });

  const formSchema = z
    .object({
      ...eventAttendantSchema.shape,
      customFields: customFieldsSchema,
    })
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
      privacyAccepted: eventAttendantData?.privacyAccepted ?? false,
      customFields: getCustomFieldsDefaults(
        customFields,
        eventAttendantData?.customFieldValues
      ),
    }
  });

  return { form, formSchema };
};
