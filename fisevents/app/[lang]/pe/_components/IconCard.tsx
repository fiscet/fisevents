import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons/lib';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function IconCard({
  title,
  Icon,
  children,
}: {
  title?: string;
  Icon: IconType;
  children: ReactNode;
}) {
  return (
    <Card className={cn('w-full relative text-center card-hover')}>
      <Icon className="w-12 h-12 mx-auto -mt-5 bg-fe-surface-container-lowest text-fe-primary" />
      <CardHeader className="py-2">
        {title && <CardTitle>{title}</CardTitle>}
      </CardHeader>
      <CardContent className="py-4 px-1">{children}</CardContent>
    </Card>
  );
}
