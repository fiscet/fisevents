import { Registration } from '@/types/sanity.types';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { formatLocalDateTime } from '@/lib/date-utils';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { slugify } from '@/lib/utils';
import RemoveAttendantDialog from '../components/RemoveAttendantDialog';

export type EventWaitlistProps = {
  eventId?: string;
  waitlist?: Registration[];
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  waitlisted: 'bg-slate-100 text-slate-700',
  expired: 'bg-rose-100 text-rose-700',
};

export default function EventWaitlist({ eventId, waitlist }: EventWaitlistProps) {
  const { creator_admin: ca } = useDictionary();
  const { attendants: d } = ca;
  const lang = useCurrentLang();

  if (!waitlist?.length) {
    return (
      <p className="text-center text-sm text-fe-on-surface-variant py-10">
        {d.waitlist_empty}
      </p>
    );
  }

  return (
    <div className="space-y-2 max-w-[650px] mx-auto">
      {waitlist.map((entry, index) => (
        <div
          key={`${index}_${slugify(entry.email!)}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-fe-outline-variant/20 px-4 py-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">{index + 1}.</span>
              <span className="font-semibold truncate">{entry.fullName}</span>
              <span
                className={`inline-flex items-center rounded-full text-[11px] font-normal px-2 py-0.5 ${STATUS_BADGE_CLASS[entry.status ?? 'waitlisted']}`}
              >
                {d.waitlist_status[entry.status as 'waitlisted' | 'expired'] ?? d.waitlist_status.waitlisted}
              </span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              <a href={`mailto:${entry.email}`}>{entry.email}</a>
              {entry.phone ? ` · ${entry.phone}` : ''}
            </div>
            <div className="text-xs text-muted-foreground">
              {d.waitlist_joined_on} {formatLocalDateTime(entry.subcribitionDate, lang)}
            </div>
          </div>
          {eventId && entry.uuid && (
            <RemoveAttendantDialog
              eventId={eventId}
              attendantUuid={entry.uuid}
              attendantName={entry.fullName!}
            />
          )}
        </div>
      ))}
    </div>
  );
}
