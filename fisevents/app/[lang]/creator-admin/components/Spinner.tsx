import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  outerSize?: string;
  childSize?: string;
}
export default function Spinner({
  className,
  outerSize,
  childSize
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'm-2 h-12 w-12 animate-spin items-center justify-center rounded-full bg-gradient-to-bl from-orange-600 to-white p-0.5',
        className,
        outerSize
      )}
    >
      <div className={cn('h-8 w-8 rounded-full bg-white', childSize)} />
    </div>
  );
}
