import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EventStatus = 'active' | 'draft' | 'past';

import { useDictionary } from '@/app/contexts/DictionaryContext';

interface EventCardProps {
  id: string;
  title: string;
  status: EventStatus;
  date?: string;
  location?: string;
  registeredCount?: number;
  capacity?: number;
  imageUrl?: string;
  editHref: string;
  onCopyLink?: () => void;
}

export function EventCard({
  id: _id,
  title,
  status,
  date,
  location,
  registeredCount = 0,
  capacity,
  imageUrl,
  editHref,
  onCopyLink,
}: EventCardProps) {
  const isPast = status === 'past';
  const isDraft = status === 'draft';
  const d = useDictionary();

  return (
    <article
      className={cn(
        'rounded-xl p-6 md:p-8',
        'flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8',
        'border border-fe-outline-variant/15 group transition-all duration-300',
        !isPast &&
          !isDraft &&
          'bg-fe-surface-container-lowest shadow-editorial hover:shadow-[0_20px_40px_-10px_rgba(21,28,39,0.1)]',
        isDraft && 'bg-fe-surface-container-low/60',
        isPast && 'bg-fe-surface-container-lowest opacity-75'
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0',
          isPast && 'grayscale',
          isDraft && 'opacity-75'
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={192}
            height={128}
            className={cn(
              'w-full h-full object-cover',
              !isPast &&
                'group-hover:scale-105 transition-transform duration-500'
            )}
          />
        ) : (
          <div className="w-full h-full bg-fe-surface-container-high flex items-center justify-center">
            <span className="text-fe-on-surface-variant text-xs font-label uppercase tracking-widest">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow space-y-2 w-full min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={status}>{status}</Badge>
          {date && (
            <span className="text-xs text-fe-on-surface-variant font-medium">
              {date}
            </span>
          )}
        </div>
        <h3 className="text-xl font-headline font-bold text-fe-on-surface truncate">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-6 text-sm text-fe-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true">👤</span>
            <span>
              <strong className="text-fe-on-surface">{registeredCount}</strong>
              {capacity ? ` / ${capacity}` : ''} registered
            </span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true">📍</span>
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col gap-3 w-full md:w-auto shrink-0">
        {!isDraft && onCopyLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyLink}
            className="flex-1 md:flex-none"
          >
            {d.creator_admin.events.copyPublicLink}
          </Button>
        )}
        {isDraft && (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex-1 md:flex-none cursor-not-allowed"
          >
            {d.creator_admin.events.copyPublicLink}
          </Button>
        )}
        <Button
          variant="primary"
          size="icon"
          asChild
          aria-label={`Edit ${title}`}
        >
          <Link href={editHref}>✏️</Link>
        </Button>
      </div>
    </article>
  );
}
