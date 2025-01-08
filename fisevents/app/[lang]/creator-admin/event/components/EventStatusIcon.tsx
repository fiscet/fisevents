'use client';

import { VscVmActive } from 'react-icons/vsc';
import { GiNightSleep } from 'react-icons/gi';
import { MdPublic } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';
import { EventStatusType } from '@/types/custom.types';

export type PublishedIconProps = React.HTMLAttributes<HTMLDivElement> & {
  publishedIcon?: ElementType;
  registrationsOpenIcon?: ElementType;
  finishedIcon?: ElementType;
  borderColor?: string;
  inset?: string;
  status: EventStatusType;
};

export default function EventStatusIcon({
  publishedIcon: PubIcon = MdPublic,
  registrationsOpenIcon: RegIcon = VscVmActive,
  finishedIcon: FinishedIcon = GiNightSleep,
  borderColor = '#ddd',
  inset = '10px',
  status
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

  switch (status) {
    case 'published':
      return <PubIcon className="w-5 h-5 text-teal-600" />;
    case 'registrations_open':
      return (
        <div className={cn('group relative flex items-center justify-center')}>
          <RegIcon className="w-5 h-5 text-teal-700" />
          <div
            className={cn(
              'absolute -inset-4 animate-ping rounded-full border-2'
            )}
            style={{ ...customBorderStyle, ...insetStyle }}
          />
        </div>
      );
    default:
      return <FinishedIcon className="w-5 h-5 text-red-400" />;
  }
}
