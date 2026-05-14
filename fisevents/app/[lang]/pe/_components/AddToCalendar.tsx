'use client';

import { FaRegCalendarPlus, FaGoogle, FaMicrosoft, FaApple } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  type CalendarEvent,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  getIcsDataUri
} from '@/lib/calendar-links';

export type AddToCalendarDict = {
  button: string;
  google: string;
  outlook: string;
  apple: string;
};

export type AddToCalendarProps = {
  event: CalendarEvent;
  dict: AddToCalendarDict;
};

export default function AddToCalendar({ event, dict }: AddToCalendarProps) {
  const links = [
    { label: dict.google, href: getGoogleCalendarUrl(event), Icon: FaGoogle, download: false },
    { label: dict.outlook, href: getOutlookCalendarUrl(event), Icon: FaMicrosoft, download: false },
    {
      label: dict.apple,
      href: getIcsDataUri(event),
      Icon: FaApple,
      download: true
    }
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" size="lg" type="button">
          <FaRegCalendarPlus className="w-4 h-4" />
          {dict.button}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <ul className="flex flex-col">
          {links.map(({ label, href, Icon, download }) => (
            <li key={label}>
              <a
                href={href}
                target={download ? undefined : '_blank'}
                rel="noopener noreferrer"
                download={download ? `${event.title}.ics` : undefined}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-fe-on-surface hover:bg-fe-surface-container transition-colors"
              >
                <Icon className="w-4 h-4 text-fe-primary" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
