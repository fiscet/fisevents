import { GiSave } from 'react-icons/gi';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type SaveButtonProps = {
  label: string;
  className?: string;
};

export default function SaveButton({
  label: text = 'Save',
  className
}: SaveButtonProps) {
  return (
    <Button size="lg" className={cn(className, 'w-full md:w-auto')}>
      <GiSave className="w-6 h-6 mr-2" /> {text}
    </Button>
  );
}
