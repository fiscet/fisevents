import { EventAttendant } from '@/types/sanity.types';
import EventAttentantTable from './EventAttentantTable';
import EventAttentantCards from './EventAttentantCards';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventAttentantListProps = {
  attendants?: EventAttendant[];
  eventDescription?: string;

};

export default function EventAttentantList({
  attendants,
  eventDescription
}: EventAttentantListProps) {

  const { creator_admin: ca } = useDictionary();
  const {attendants: d} = ca;

  return (
    <div>
      <div className="mb-2 text-center">
        <h2 className="uppercase font-medium text-xl">
          {attendants?.length} {d.attendants}
        </h2>
        <h3 className="italic text-lg">{eventDescription}</h3>
      </div>
      <EventAttentantTable
        attendants={attendants}
        eventDescription={eventDescription}
      />
      <EventAttentantCards
        attendants={attendants}
        eventDescription={eventDescription}
      />
    </div>
  );
}
