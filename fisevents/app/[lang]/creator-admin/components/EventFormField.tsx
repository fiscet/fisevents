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

type EventFormFieldProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  formComponent: ElementType;
  formComponentClassName?: string;
  formComponentProps?: {};
  description?: string;
  forceNumber?: boolean;
};

export default function EventFormField({
  form,
  name,
  label,
  formComponent: FormComp,
  formComponentClassName,
  formComponentProps,
  description,
  forceNumber
}: EventFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FormComp
              {...field}
              className={formComponentClassName}
              value={forceNumber ? Number(field.value) : field.value}
              {...formComponentProps}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <div className="absolute whitespace-nowrap">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
