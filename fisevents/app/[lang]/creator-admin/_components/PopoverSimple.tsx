import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export type PopoverSimpleProps = {
  label: string;
  children: React.ReactNode;
};

export default function PopoverSimple({ label, children }: PopoverSimpleProps) {
  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent>
          <p>{label}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
