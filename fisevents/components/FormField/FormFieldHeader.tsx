import { useDictionary } from '@/app/contexts/DictionaryContext';
import { FormLabel } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { RiInformation2Fill } from 'react-icons/ri';
import { RequiredStatus } from './DefaultFormField';

export default function FormFieldHeader({
  label,
  description,
  inForm = true,
  requiredStatus
}: {
  label: string;
  description?: string;
  inForm?: boolean;
  requiredStatus?: RequiredStatus;
}) {
  const { common: c } = useDictionary();

  let labelText = label;
  let labelClass = '';

  switch (requiredStatus) {
    case 'required':
      labelText = `${label} *`;
      break;
    case 'optional-with-text':
      labelText = `${label} (${c.optional})`;
      labelClass = 'text-gray-600 italic';
      break;
    case 'optional':
      labelClass = 'text-gray-600 italic';
      break;
    default:
      break;
  }

  return (
    <div className="w-full flex align-center justify-between mr-2">
      {inForm ? (
        <FormLabel className={labelClass}>{labelText}</FormLabel>
      ) : (
        <label className={labelClass}>{labelText}</label>
      )}
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
  );
}
