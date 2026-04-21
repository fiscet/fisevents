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
      <div className="mb-4 text-center">
        <h2 className="font-semibold text-2xl">
          {attendants?.length} {d.attendants}
        </h2>
        <p className="text-sm text-fe-on-surface-variant mt-1">{eventDescription}</p>
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
