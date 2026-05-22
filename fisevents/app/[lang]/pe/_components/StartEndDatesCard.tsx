import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { MdDateRange } from 'react-icons/md';
import IconCard from './IconCard';
import { formatEventDateTime } from '@/lib/date-utils';

export type StartEndDatesProps = {
  startDate: string;
  endDate: string;
  lang: Locale;
  timeZone?: string;
};

export default async function StartEndDatesCard({
  startDate,
  endDate,
  lang,
  timeZone
}: StartEndDatesProps) {
  const dictionary = (await getDictionary(lang)).public;

  const startDateTmst = Date.parse(startDate);
  const endDateTmst = Date.parse(endDate);

  const isSameDay = endDateTmst - startDateTmst < 86400000;

  const preDate = isSameDay
    ? formatEventDateTime(endDateTmst, lang, timeZone, { dateStyle: 'short' })
    : '';

  const startDateText = isSameDay
    ? formatEventDateTime(startDateTmst, lang, timeZone, {
        timeStyle: 'short',
        hour12: false
      })
    : formatEventDateTime(startDateTmst, lang, timeZone, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      });

  const endDateText = isSameDay
    ? formatEventDateTime(endDateTmst, lang, timeZone, {
        timeStyle: 'short',
        hour12: false
      })
    : formatEventDateTime(endDateTmst, lang, timeZone, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      });

  const title = isSameDay ? preDate : dictionary.dates;

  return (
    <IconCard Icon={MdDateRange} title={title}>
      <div className="flex justify-center items-center gap-1">
        <span className="text-fe-on-surface-variant font-medium text-sm">
          {isSameDay ? dictionary.from_hour : dictionary.from_date}
        </span>
        <span className="font-semibold">{startDateText}</span>
      </div>
      <div className="flex justify-center items-center gap-1">
        <span className="text-fe-on-surface-variant font-medium text-sm">
          {isSameDay ? dictionary.to_hour : dictionary.to_date}
        </span>
        <span className="font-semibold">{endDateText}</span>
      </div>
    </IconCard>
  );
}
