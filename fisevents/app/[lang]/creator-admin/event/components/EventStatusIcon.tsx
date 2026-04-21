'use client';

import { cn } from '@/lib/utils';
import { EventStatusType } from '@/types/custom.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type PublishedIconProps = {
  status: EventStatusType;
  inset?: string;
};

export default function EventStatusIcon({ status }: PublishedIconProps) {
  const { creator_admin: ca } = useDictionary();
  const { events: d } = ca;

  const config: Record<EventStatusType, { label: string; className: string }> = {
    published: {
      label: d.published_short,
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    registrations_open: {
      label: d.registrations_open_short,
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    finished: {
      label: d.finished_short,
      className: 'bg-slate-100 text-slate-500 border-slate-200',
    },
  };

  const { label, className } = config[status] ?? config.finished;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap',
        className
      )}
    >
      {label}
    </span>
  );
}
