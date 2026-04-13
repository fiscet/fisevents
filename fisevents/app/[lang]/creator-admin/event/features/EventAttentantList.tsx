import { EventAttendant } from '@/types/sanity.types';
import EventAttentantTable from './EventAttentantTable';
import EventAttentantCards from './EventAttentantCards';
import AddAttendantModal from '../components/AddAttendantModal';
import ExportCsvButton from '../components/ExportCsvButton';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventAttentantListProps = {
  eventId?: string;
  attendants?: EventAttendant[];
  eventDescription?: string;
};

export default function EventAttentantList({
  eventId,
  attendants,
  eventDescription,
}: EventAttentantListProps) {
  const { creator_admin: ca } = useDictionary();
  const { attendants: d } = ca;

  return (
    <div>
      <div className="mb-2 text-center">
        <h2 className="uppercase font-medium text-xl">
          {attendants?.length} {d.attendants}
        </h2>
        <h3 className="italic text-lg">{eventDescription}</h3>
        {eventId && (
          <div className="mt-4 flex justify-center gap-4">
            <AddAttendantModal eventId={eventId} />
            <ExportCsvButton
              attendants={attendants}
              filename={`attendants-${eventId}.csv`}
            />
          </div>
        )}
      </div>
      <EventAttentantTable
        eventId={eventId}
        attendants={attendants}
        eventDescription={eventDescription}
      />
      <EventAttentantCards
        eventId={eventId}
        attendants={attendants}
        eventDescription={eventDescription}
      />
    </div>
  );
}
