import {
  FormField,
  FormItem
} from '@/components/ui/form';

import { ElementType } from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormFieldHeader from './FormFieldHeader';
import FormFieldControl from './FormFieldControl';
import AccordionComponent from './AccordionComponent';

type DefaultFormFieldProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  formComponent: ElementType;
  formComponentClassName?: string;
  formComponentProps?: {};
  description?: string;
  forceNumber?: boolean;
  isAccordion?: boolean;
};

export default function DefaultFormField({
  form,
  name,
  label,
  formComponent,
  formComponentClassName,
  formComponentProps,
  description,
  forceNumber,
  isAccordion
}: DefaultFormFieldProps) {
  if (isAccordion) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative mb-1">
            <AccordionComponent
              triggerComponent={
                <FormFieldHeader label={label} description={description} />
              }>
              <FormFieldControl
                formComponent={formComponent}
                formComponentClassName={formComponentClassName}
                formComponentProps={formComponentProps}
                forceNumber={forceNumber}
                field={field} />
            </AccordionComponent>
          </FormItem>
        )}
      />
    );
  }

  return <SimpleFormField
    form={form}
    name={name}
    label={label}
    formComponent={formComponent}
    formComponentClassName={formComponentClassName}
    formComponentProps={formComponentProps}
    description={description}
    forceNumber={forceNumber}
  />;
}

function SimpleFormField({
  form,
  name,
  label,
  formComponent,
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
          <FormFieldHeader label={label} description={description} />
          <FormFieldControl
            formComponent={formComponent}
            formComponentClassName={formComponentClassName}
            formComponentProps={formComponentProps}
            forceNumber={forceNumber}
            field={field} />
        </FormItem>
      )}
    />
  );
}

