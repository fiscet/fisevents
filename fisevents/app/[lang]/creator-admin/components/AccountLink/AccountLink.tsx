'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TooltipSimple from '../TooltipSimple';
import { cn } from '@/lib/utils';

export type AccountLinkProps = {
  label: string;
  href: string;
  pictureUrl?: string;
};

export default function AccountLink({
  label,
  href,
  pictureUrl
}: AccountLinkProps) {
  return (
    <TooltipSimple label={label}>
      <Link href={href}>
        <Avatar
          className={cn(
            'transition-opacity duration-500 ease-in-out',
            href ? 'opacity-100 hover:opacity-60' : 'opacity-0'
          )}
        >
          <AvatarImage src={pictureUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
    </TooltipSimple>
  );
}
