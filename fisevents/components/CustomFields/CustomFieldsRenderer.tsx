'use client';

import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCustomFieldKey, type CustomFieldDefInput } from '@/lib/custom-fields';

export type CustomFieldsRendererProps<T extends FieldValues = FieldValues> = {
  form: UseFormReturn<T>;
  customFields?: CustomFieldDefInput[];
  selectPlaceholder?: string;
};

export default function CustomFieldsRenderer<
  T extends FieldValues = FieldValues,
>({ form, customFields, selectPlaceholder }: CustomFieldsRendererProps<T>) {
  if (!customFields || customFields.length === 0) return null;

  return (
    <>
      {customFields.map((def) => {
        const key = getCustomFieldKey(def);
        if (!key) return null;
        const name = `customFields.${key}` as Path<T>;
        const requiredMark = def.required ? ' *' : '';

        if (def.fieldType === 'checkbox') {
          return (
            <FormField
              key={key}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <div className="w-full flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel style={{ margin: 0 }}>
                      {def.label}
                      {requiredMark}
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        if (def.fieldType === 'select') {
          return (
            <FormField
              key={key}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {def.label}
                    {requiredMark}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectPlaceholder ?? ''} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(def.options ?? []).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        // text & number
        return (
          <FormField
            key={key}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {def.label}
                  {requiredMark}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={(field.value as string) ?? ''}
                    type={def.fieldType === 'number' ? 'number' : 'text'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
}
