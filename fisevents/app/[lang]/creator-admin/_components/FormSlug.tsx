import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MdOutlineGeneratingTokens } from 'react-icons/md';
import { UseFormReturn } from 'react-hook-form';
import { slugify } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { RiInformation2Fill } from 'react-icons/ri';

export type FormSlugProps = {
  form: UseFormReturn<any>;
  label: string;
  description?: string;
  sourceItem: string;
};

export default function FormSlug({
  form,
  label,
  description,
  sourceItem
}: FormSlugProps) {
  const handleSetSlug = () => {
    if (sourceItem) {
      const slug = slugify(sourceItem);
      form.setValue('slug.current', slug);
    }
  };

  const handleSetSlugOnFocus = () => {
    if (!form.getValues('slug.current')) {
      handleSetSlug();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <FormField
        control={form.control}
        name="slug.current"
        render={({ field }) => (
          <FormItem className="relative flex-grow mb-1">
            <div className="w-full flex align-center justify-between">
              <FormLabel>{label}</FormLabel>
              {description && (
                <Popover>
                  <PopoverTrigger>
                    <RiInformation2Fill className="w-5 h-5 text-gray-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white shadow-lg">
                    <div className="p-4">
                      <p className="text-gray-600 mt-2">{description}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <FormControl>
              <Input {...field} onFocus={handleSetSlugOnFocus} />
            </FormControl>
            <div className="absolute whitespace-nowrap">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <MdOutlineGeneratingTokens
        className="w-5 h-5 text-orange-600 mb-2 cursor-pointer"
        onClick={handleSetSlug}
      />
    </div>
  );
}
