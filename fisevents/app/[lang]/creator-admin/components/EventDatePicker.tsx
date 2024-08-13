import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { SelectSingleEventHandler } from 'react-day-picker';

export type EventDatePickerProps = {
  value: number | Date;
  onChange: SelectSingleEventHandler;
};

export default function EventDatePicker({
  value,
  onChange
}: EventDatePickerProps) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !value && 'text-muted-foreground'
              )}
            >
              {value ? format(value, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value as Date}
            onSelect={onChange}
            disabled={(date) =>
              date > new Date() || date < new Date('1900-01-01')
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
