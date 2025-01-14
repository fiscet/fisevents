import { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons/lib';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '100'
});

export default function IconCard({
  title,
  Icon,
  children
}: {
  title?: string;
  Icon: IconType;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn('w-full  relative text-center shadow-md', roboto.className)}
    >
      <Icon className="w-12 h-12 mx-auto -mt-5 bg-white text-orange-600" />
      <CardHeader className="py-2">
        {title && <CardTitle>{title}</CardTitle>}
      </CardHeader>
      <CardContent className="py-4 px-1">{children}</CardContent>
    </Card>
  );
}
