import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';
import { IconType } from 'react-icons/lib';

export default function IconText({
  Icon,
  containerClassName,
  iconClassName,
  children,
}: {
  Icon: IconType;
  containerClassName?: string;
  iconClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex gap-4 items-center pl-2', containerClassName)}>
      <Icon
        className={cn('w-12 h-12 text-fe-primary shrink-0', iconClassName)}
      />
      {children}
    </div>
  );
}
