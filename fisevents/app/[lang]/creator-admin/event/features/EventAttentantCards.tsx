import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TfiEmail } from 'react-icons/tfi';
import { FaPhone } from 'react-icons/fa6';
import { FcAlarmClock } from 'react-icons/fc';
import { slugify } from '@/lib/utils';
import { CustomFieldDef, Registration } from '@/types/sanity.types';
import { getAttendantCustomValue, getCustomFieldKey } from '@/lib/custom-fields';
import { formatLocalDateTime } from '@/lib/date-utils';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import RemoveAttendantDialog from '../components/RemoveAttendantDialog';
import AttendantStatusToggle from '../components/AttendantStatusToggle';
import PaymentStatusSelect from '../components/PaymentStatusSelect';

export type EventAttentantCardsProps = {
  eventId?: string;
  attendants?: Registration[];
  customFields?: Array<Partial<CustomFieldDef>>;
  eventDescription?: string;
};

export default function EventAttentantCards({
  eventId,
  attendants,
  customFields,
  eventDescription,
}: EventAttentantCardsProps) {
  const lang = useCurrentLang();
  const customDefs = (customFields ?? []).filter((f) => getCustomFieldKey(f));
  return (
    <div className="md:hidden">
      {attendants &&
        attendants.map((attendant, index) => (
          <Card key={`${index}_${slugify(attendant.email!)}`} className="my-1">
            <CardHeader>
              <CardTitle className="relative flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-sm absolute top-0 right-0 translate-x-[18px] -translate-y-[20px]">
                    {index + 1}.
                  </span>
                  {attendant.fullName}
                </div>
                {eventId && attendant.uuid && (
                  <RemoveAttendantDialog
                    eventId={eventId}
                    attendantUuid={attendant.uuid}
                    attendantName={attendant.fullName!}
                  />
                )}
              </CardTitle>
              <CardDescription>{eventDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center mb-1">
                <TfiEmail />
                <a href={`mailto:${attendant.email}`}>{attendant.email}</a>
              </div>
              {attendant.phone && (
                <div className="flex gap-2 items-center mb-4">
                  <FaPhone />
                  {attendant.phone}
                </div>
              )}
              {customDefs.length > 0 && (
                <div className="mb-4 space-y-1">
                  {customDefs.map((f) => (
                    <div key={getCustomFieldKey(f)} className="text-sm">
                      <span className="text-muted-foreground">{f.label}: </span>
                      {getAttendantCustomValue(attendant, f)}
                    </div>
                  ))}
                </div>
              )}
              {eventId && attendant.uuid && (
                <div className="flex gap-4 items-center">
                  <AttendantStatusToggle
                    eventId={eventId}
                    attendantUuid={attendant.uuid}
                    checkedIn={attendant.checkedIn}
                  />
                  <PaymentStatusSelect
                    eventId={eventId}
                    attendantUuid={attendant.uuid}
                    paymentStatus={attendant.paymentStatus}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 items-center mt-2 border-t pt-2 w-full text-muted-foreground text-sm">
                <FcAlarmClock className="w-4 h-4" />
                {formatLocalDateTime(attendant.subcribitionDate, lang)}
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
