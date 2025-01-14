import { Locale } from '@/lib/i18n';
import { Roboto } from 'next/font/google';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n.utils';
import { MdDateRange } from 'react-icons/md';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import IconCard from './IconCard';

export type StartEndDatesProps = {
  startDate: string;
  endDate: string;
  lang: Locale;
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: '100'
});

export default async function StartEndDatesCard({
  startDate,
  endDate,
  lang
}: StartEndDatesProps) {
  const dictionary = (await getDictionary(lang)).public;

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

  const title = isSameDay ? dictionary.from_hour : dictionary.from_date;

  return (
    <IconCard Icon={MdDateRange} title={title}>
      <div className="flex justify-center items-center gap-1">
        <span className="text-emerald-600 font-bold">
          {isSameDay ? dictionary.from_hour : dictionary.from_date}
        </span>
        <span>{startDateText}</span>
      </div>
      <div className="flex justify-center items-center gap-1">
        <span className="text-red-600 font-bold">
          {isSameDay ? dictionary.to_hour : dictionary.to_date}
        </span>
        <span>{endDateText}</span>
      </div>
    </IconCard>
  );
}
