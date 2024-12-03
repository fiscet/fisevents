import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

export type EventFormActiveProps = {
  form: UseFormReturn<any>;
  activeText?: string;
  notActiveText?: string;
};

export default function EventFormActive({
  form,
  activeText,
  notActiveText
}: EventFormActiveProps) {
  return (
    <FormField
      control={form.control}
      name="active"
      render={({ field }) => (
        <FormItem className="flex flex-row-reverse md:flex-row gap-2 items-center justify-end md:justify-between md:mb-5">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel style={{ margin: 0 }}>
            {field.value ? activeText : notActiveText}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
