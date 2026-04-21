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
import { EventAttendant } from '@/types/sanity.types';
import RemoveAttendantDialog from '../components/RemoveAttendantDialog';
import AttendantStatusToggle from '../components/AttendantStatusToggle';
import PaymentStatusSelect from '../components/PaymentStatusSelect';

export type EventAttentantTableProps = {
  eventId?: string;
  attendants?: EventAttendant[];
  eventDescription?: string;
};

export default function EventAttentantTable({
  eventId,
  attendants,
  eventDescription,
}: EventAttentantTableProps) {
  const { creator_admin: ca } = useDictionary();
  const { attendants: d } = ca;

  return (
    <Table className="hidden md:table">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{d.fullname}</TableHead>
          <TableHead>{d.email}</TableHead>
          <TableHead>{d.phone}</TableHead>
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
                  <span>{attendant.fullName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {new Date(attendant.subcribitionDate!).toLocaleString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <a href={`mailto:${attendant.email}`}>{attendant.email}</a>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {attendant.phone}
              </TableCell>
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
