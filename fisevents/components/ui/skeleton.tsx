import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-fe-outline-variant/25',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
