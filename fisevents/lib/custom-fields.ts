import { z } from 'zod';
import { slugify } from '@/lib/utils';
import type { CustomFieldDef, CustomFieldValue } from '@/types/sanity.types';

export type CustomFieldDefInput = Partial<CustomFieldDef>;
export type CustomFieldFormValue = string | boolean;
export type CustomFieldsFormValues = Record<string, CustomFieldFormValue>;

export type CustomFieldMessages = {
  required: string;
  invalidNumber: string;
};

/** Stable key used both as the form field name and the stored `name`. */
export const getCustomFieldKey = (def: CustomFieldDefInput): string =>
  def.name || (def.label ? slugify(def.label) : '') || def._key || '';

/** Default form values for the custom fields object, optionally seeded from existing answers. */
export const getCustomFieldsDefaults = (
  customFields?: CustomFieldDefInput[],
  existing?: Array<Partial<CustomFieldValue>>
): CustomFieldsFormValues => {
  const result: CustomFieldsFormValues = {};
  (customFields ?? []).forEach((def) => {
    const key = getCustomFieldKey(def);
    if (!key) return;
    const prev = existing?.find((v) => v.name === key)?.value;
    result[key] =
      def.fieldType === 'checkbox' ? prev === 'true' : (prev ?? '');
  });
  return result;
};

/** Builds the zod schema for the dynamic `customFields` form object. */
export const buildCustomFieldsSchema = (
  customFields: CustomFieldDefInput[] | undefined,
  messages: CustomFieldMessages
): z.ZodType<CustomFieldsFormValues> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  (customFields ?? []).forEach((def) => {
    const key = getCustomFieldKey(def);
    if (!key) return;

    if (def.fieldType === 'checkbox') {
      shape[key] = def.required
        ? z.literal(true, { errorMap: () => ({ message: messages.required }) })
        : z.boolean();
      return;
    }

    let field: z.ZodTypeAny = z.string();
    if (def.fieldType === 'number') {
      field = (field as z.ZodString).refine(
        (v) => v === '' || !Number.isNaN(Number(v)),
        { message: messages.invalidNumber }
      );
    }
    if (def.required) {
      field = field.refine((v: string) => v.trim().length > 0, {
        message: messages.required,
      });
    }
    shape[key] = field;
  });

  return z.object(shape) as unknown as z.ZodType<CustomFieldsFormValues>;
};

/** Reads an attendant's answer for a given field definition, formatted for display. */
export const getAttendantCustomValue = (
  attendant: { customFieldValues?: Array<Partial<CustomFieldValue>> },
  def: CustomFieldDefInput
): string => {
  const key = getCustomFieldKey(def);
  const raw =
    attendant.customFieldValues?.find((v) => v.name === key)?.value ?? '';
  if (def.fieldType === 'checkbox') {
    return raw === 'true' ? '✓' : raw === 'false' ? '—' : raw;
  }
  return raw;
};

/** Converts the dynamic form values into the array stored on the attendant. */
export const customFieldsValuesToArray = (
  customFields: CustomFieldDefInput[] | undefined,
  values: CustomFieldsFormValues | undefined
): Array<Pick<CustomFieldValue, 'name' | 'label' | 'value'>> => {
  if (!customFields || !values) return [];
  return customFields
    .map((def) => {
      const key = getCustomFieldKey(def);
      const raw = values[key];
      const value =
        typeof raw === 'boolean' ? (raw ? 'true' : 'false') : (raw ?? '');
      return { name: key, label: def.label ?? key, value };
    })
    .filter((v) => v.name);
};
