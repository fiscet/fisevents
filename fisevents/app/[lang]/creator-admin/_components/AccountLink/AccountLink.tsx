'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PopoverSimple from '../PopoverSimple';
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
  const labelChunks = label.split(' ');

  const firstChar = labelChunks[0].substring(0, 1).toUpperCase();
  const secondChar = labelChunks[1].substring(0, 1).toUpperCase();

  return (
    <PopoverSimple label={label}>
      <Link href={href}>
        <Avatar
          className={cn(
            'transition-opacity duration-500 ease-in-out',
            href ? 'opacity-100 hover:opacity-60' : 'opacity-0'
          )}
        >
          <AvatarImage src={pictureUrl} />
          <AvatarFallback>
            {firstChar}
            {secondChar}
          </AvatarFallback>
        </Avatar>
      </Link>
    </PopoverSimple>
  );
}
