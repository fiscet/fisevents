'use client';

import { VscVmActive } from 'react-icons/vsc';
import { GiNightSleep } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';

export type PublishedIconProps = React.HTMLAttributes<HTMLDivElement> & {
  publishedIcon?: ElementType;
  unPublishedIcon?: ElementType;
  borderColor?: string;
  inset?: string;
  isOngoing: boolean;
};

export default function PublishedIcon({
  publishedIcon: PubIcon = VscVmActive,
  unPublishedIcon: UnpubIcon = GiNightSleep,
  borderColor = '#ddd',
  inset = '10px',
  isOngoing = true
}: PublishedIconProps) {
  const customBorderStyle = {
    borderColor
  };
  const insetStyle = {
    top: `-${inset}`,
    bottom: `-${inset}`,
    left: `-${inset}`,
    right: `-${inset}`
  };

  if (isOngoing) {
    return (
      <div className={cn('group relative flex items-center justify-center')}>
        <PubIcon className="w-5 h-5 text-teal-600" />
        <div
          className={cn('absolute -inset-4 animate-ping rounded-full border-2')}
          style={{ ...customBorderStyle, ...insetStyle }}
        />
      </div>
    );
  }

  return <UnpubIcon className="w-5 h-5 text-red-400" />;
}
