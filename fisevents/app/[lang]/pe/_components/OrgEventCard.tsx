import Image from 'next/image';
import Link from 'next/link';
import { OrgPublicEvent } from '@/types/sanity.extended.types';
import { Locale } from '@/lib/i18n';
import { MdLocationOn, MdDateRange } from 'react-icons/md';

export type OrgEventCardProps = {
  event: OrgPublicEvent;
  lang: Locale;
  registerLabel: string;
  fullLabel: string;
  placesLeftLabel: string;
  freeLabel: string;
};

export default function OrgEventCard({
  event,
  lang,
  registerLabel,
  fullLabel,
  placesLeftLabel,
  freeLabel,
}: OrgEventCardProps) {
  const startDate = new Date(event.startDate).toLocaleDateString(lang, {
    dateStyle: 'medium',
  });

  const isFull = !!event.maxSubscribers && event.remainingPlaces <= 0;
  const isAlmostFull =
    !!event.maxSubscribers &&
    event.remainingPlaces > 0 &&
    event.remainingPlaces <= 3;

  return (
    <div className="rounded-2xl border border-fe-outline-variant/20 bg-fe-surface-container-lowest overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div className="relative w-full h-40 bg-fe-surface-container shrink-0">
        {event.pageImage?.url ? (
          <Image
            src={event.pageImage.url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-fe-primary/20 to-fe-primary-container/30" />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-semibold text-fe-on-surface line-clamp-2 leading-snug">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-fe-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <MdDateRange className="w-4 h-4 shrink-0" />
            <span>{startDate}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MdLocationOn className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>

        <span className="text-sm font-medium text-fe-primary">
          {event.price || freeLabel}
        </span>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          {isAlmostFull && (
            <span className="text-xs text-orange-600 font-medium shrink-0">
              {event.remainingPlaces} {placesLeftLabel}
            </span>
          )}
          {isFull ? (
            <span className="text-xs text-red-600 font-medium ml-auto">{fullLabel}</span>
          ) : (
            <Link
              href={`/${lang}/${event.publicSlug}`}
              className="ml-auto inline-flex items-center gap-1 bg-fe-primary text-fe-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {registerLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
