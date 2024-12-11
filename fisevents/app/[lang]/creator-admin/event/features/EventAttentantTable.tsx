import { useDictionary } from '@/app/contexts/DictionaryContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { slugify } from '@/lib/utils';
import { EventAttendant } from '@/types/sanity.types';

export type EventAttentantTableProps = {
  attendants?: EventAttendant[];
  eventDescription?: string;
};

export default function EventAttentantTable({
  attendants,
  eventDescription
}: EventAttentantTableProps) {
  const { creator_admin: ca } = useDictionary();
  const {attendants: d} = ca;

  return (
    <Table className="hidden md:table">
      <TableCaption>
        <h2 className="uppercase font-medium">{d.attendants}</h2>
        <h3 className="italic">{eventDescription}</h3>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{d.fullname}</TableHead>
          <TableHead>{d.email}</TableHead>
          <TableHead>{d.phone}</TableHead>
          <TableHead>{d.subcribitionDate}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendants &&
          attendants.map((attendant, index) => (
            <TableRow
              key={slugify(attendant.email!)}
              className={index % 2 === 0 ? 'bg-yellow-50' : ''}
            >
              <TableCell className="whitespace-nowrap font-bold w-full">
                {attendant.fullName}
              </TableCell>
              <TableCell>
                <a href={`mailto:${attendant.email}`}>{attendant.email}</a>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {attendant.phone}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(attendant.subcribitionDate!).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
