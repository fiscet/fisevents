import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { ElementType } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RiInformation2Fill } from 'react-icons/ri';

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
          <div className="w-full flex align-center justify-between">
            <FormLabel>{label}</FormLabel>
            {description && (
              <HoverCard>
                <HoverCardTrigger>
                  <RiInformation2Fill className="w-5 h-5 text-gray-600" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-white shadow-lg">
                  <div className="p-4">
                    <p className="text-gray-600 mt-2">{description}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
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
