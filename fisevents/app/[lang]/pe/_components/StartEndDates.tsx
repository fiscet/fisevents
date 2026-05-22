import { Locale } from '@/lib/i18n';
import { MdDateRange } from 'react-icons/md';
import IconText from './IconText';
import { formatEventDateTime } from '@/lib/date-utils';

export type StartEndDatesProps = {
  startDate: string;
  endDate: string;
  lang: Locale;
  timeZone?: string;
};

export default function StartEndDates({
  startDate,
  endDate,
  lang,
  timeZone
}: StartEndDatesProps) {
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

  return (
    <IconText Icon={MdDateRange}>
      {preDate && <span>{preDate}</span>}
      <span className="text-emerald-600 font-bold">From</span>
      {startDateText}
      <span className="text-red-600 font-bold">To</span>
      {endDateText}
    </IconText>
  );
}
