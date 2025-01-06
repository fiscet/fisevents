import { FormControl, FormMessage } from '@/components/ui/form';
import { ElementType } from 'react';

export type FormFieldControlProps = {
  formComponent: ElementType;
  formComponentClassName?: string;
  formComponentProps?: {};
  forceNumber?: boolean;
  field: any;
};

export default function FormFieldControl({
  formComponent: FormComp,
  formComponentClassName,
  formComponentProps,
  forceNumber,
  field
}: FormFieldControlProps) {
  return (
    <>
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
    </>
  );
}
