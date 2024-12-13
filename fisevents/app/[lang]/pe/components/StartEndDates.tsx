import { Locale } from '@/lib/i18n';
import { MdDateRange } from 'react-icons/md';
import IconText from './IconText';

export type StartEndDatesProps = {
  startDate: string;
  endDate: string;
  lang: Locale;
};

export default function StartEndDates({
  startDate,
  endDate,
  lang
}: StartEndDatesProps) {
  const startDateTmst = Date.parse(startDate);
  const endDateTmst = Date.parse(endDate);

  const isSameDay = endDateTmst - startDateTmst < 86400000;

  const preDate = isSameDay
    ? new Date(endDateTmst).toLocaleDateString(lang, { dateStyle: 'short' })
    : '';

  const startDateText = isSameDay
    ? new Date(startDateTmst).toLocaleTimeString(lang, {
        timeStyle: 'short',
        hour12: false
      })
    : new Date(startDateTmst).toLocaleString(lang, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      });

  const endDateText = isSameDay
    ? new Date(endDateTmst).toLocaleTimeString(lang, {
        timeStyle: 'short',
        hour12: false
      })
    : new Date(endDateTmst).toLocaleString(lang, {
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
