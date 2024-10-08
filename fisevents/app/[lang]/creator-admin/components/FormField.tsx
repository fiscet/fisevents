import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ElementType } from 'react';
import { UseFormReturn } from 'react-hook-form';

type DefaultFormFieldProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  formComponent: ElementType;
  formComponentClassName?: string;
  formComponentProps?: {};
  description?: string;
  forceNumber?: boolean;
};

export default function DefaultFormField({
  form,
  name,
  label,
  formComponent: FormComp,
  formComponentClassName,
  formComponentProps,
  description,
  forceNumber
}: DefaultFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative mb-1">
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <FormComp
              {...field}
              className={formComponentClassName}
              value={forceNumber ? Number(field.value) : field.value}
              {...formComponentProps}
            />
          </FormControl>
          <div className="absolute whitespace-nowrap">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
