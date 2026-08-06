import { useDictionary } from '@/app/contexts/DictionaryContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { slugify } from '@/lib/utils';
import { CustomFieldDef, Registration } from '@/types/sanity.types';
import { getAttendantCustomValue, getCustomFieldKey } from '@/lib/custom-fields';
import { formatLocalDateTime } from '@/lib/date-utils';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import RemoveAttendantDialog from '../components/RemoveAttendantDialog';
import AttendantStatusToggle from '../components/AttendantStatusToggle';
import PaymentStatusSelect from '../components/PaymentStatusSelect';

export type EventAttentantTableProps = {
  eventId?: string;
  attendants?: Registration[];
  customFields?: Array<Partial<CustomFieldDef>>;
  eventDescription?: string;
};

export default function EventAttentantTable({
  eventId,
  attendants,
  customFields,
  eventDescription,
}: EventAttentantTableProps) {
  const { creator_admin: ca } = useDictionary();
  const { attendants: d } = ca;
  const lang = useCurrentLang();

  const customDefs = (customFields ?? []).filter((f) => getCustomFieldKey(f));

  return (
    <Table className="hidden md:table">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{d.fullname}</TableHead>
          <TableHead>{d.email}</TableHead>
          <TableHead>{d.phone}</TableHead>
          {customDefs.map((f) => (
            <TableHead key={getCustomFieldKey(f)} className="whitespace-nowrap">
              {f.label}
            </TableHead>
          ))}
          <TableHead>{d.status}</TableHead>
          <TableHead>{d.payment}</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendants &&
          attendants.map((attendant, index) => (
            <TableRow
              key={`${index}_${slugify(attendant.email!)}`}
              className={index % 2 === 0 ? 'bg-slate-50/60' : ''}
            >
              <TableCell className="whitespace-nowrap font-bold w-full">
                <div className="flex flex-col">
                  <span className="flex items-center gap-2">
                    {attendant.fullName}
                    {attendant.status === 'offered' && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[11px] font-normal px-2 py-0.5">
                        {d.waitlist_status.offered}
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {formatLocalDateTime(attendant.subcribitionDate, lang)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <a href={`mailto:${attendant.email}`}>{attendant.email}</a>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {attendant.phone}
              </TableCell>
              {customDefs.map((f) => (
                <TableCell
                  key={getCustomFieldKey(f)}
                  className="whitespace-nowrap"
                >
                  {getAttendantCustomValue(attendant, f)}
                </TableCell>
              ))}
              <TableCell className="whitespace-nowrap">
                {eventId && attendant.uuid && (
                  <AttendantStatusToggle
                    eventId={eventId}
                    attendantUuid={attendant.uuid}
                    checkedIn={attendant.checkedIn}
                  />
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {eventId && attendant.uuid && (
                  <PaymentStatusSelect
                    eventId={eventId}
                    attendantUuid={attendant.uuid}
                    paymentStatus={attendant.paymentStatus}
                  />
                )}
              </TableCell>
              <TableCell>
                {eventId && attendant.uuid && (
                  <RemoveAttendantDialog
                    eventId={eventId}
                    attendantUuid={attendant.uuid}
                    attendantName={attendant.fullName!}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
