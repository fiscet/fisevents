import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { IconType } from 'react-icons/lib';

export default function IconText({
  Icon,
  containerClassName,
  iconClassName,
  children
}: {
  Icon: IconType;
  containerClassName?: string;
  iconClassName?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className={cn('flex gap-2 items-center pl-2', containerClassName)}>
        <Icon className={cn('w-5 h-5 text-blue-700', iconClassName)} />
        {children}
      </div>
      <Separator className="my-4" />
    </>
  );
}
