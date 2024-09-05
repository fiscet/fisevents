import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { TfiEmail } from 'react-icons/tfi';
import { FaPhone } from 'react-icons/fa6';
import { FcAlarmClock } from 'react-icons/fc';
import { getDictionary } from '@/lib/i18n.utils';
import { slugify } from '@/lib/utils';
import { EventAttendant } from '@/types/sanity.types';

export type EventAttentantCardsProps = {
  attendants?: EventAttendant[];
  eventDescription?: string;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['attendants'];
};

export default function EventAttentantCards({
  attendants,
  eventDescription,
  dictionary
}: EventAttentantCardsProps) {
  return (
    <div className="md:hidden">
      {attendants &&
        attendants.map((attendant, index) => (
          <Card key={slugify(attendant.email!)} className="my-1">
            <CardHeader>
              <CardTitle className="relative">
                <span className="text-slate-500 text-sm absolute top-0 right-0 translate-x-[18px] -translate-y-[20px]">
                  {index + 1}.
                </span>
                {attendant.fullName}
              </CardTitle>
              <CardDescription>{eventDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center mb-1">
                <TfiEmail />
                <a href={`mailto:${attendant.email}`}>{attendant.email}</a>
              </div>
              {attendant.phone && (
                <div className="flex gap-2 items-center mb-1">
                  <FaPhone />
                  {attendant.phone}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 items-center">
                <FcAlarmClock className="w-5 h-5" />
                {new Date(attendant.subcribitionDate!).toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
