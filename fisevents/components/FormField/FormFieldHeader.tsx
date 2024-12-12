import {
  FormControl,
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
import { RiInformation2Fill } from 'react-icons/ri';

export default function FormFieldHeader({ label, description }: { label: string, description?: string }) {
  return (
    <div className="w-full flex align-center justify-between mr-2">
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
  );
}