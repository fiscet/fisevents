import { Roboto } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';
import { IconType } from 'react-icons/lib';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '100'
});

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
      <div
        className={cn(
          'flex gap-4 items-center pl-2',
          containerClassName,
          roboto.className
        )}
      >
        <Icon className={cn('w-12 h-12 text-orange-600', iconClassName)} />
        {children}
      </div>
      <Separator className="my-4" />
    </>
  );
}
