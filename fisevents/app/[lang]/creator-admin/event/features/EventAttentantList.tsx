import { EventAttendant } from '@/types/sanity.types';
import EventAttentantTable from './EventAttentantTable';
import EventAttentantCards from './EventAttentantCards';
import AddAttendantModal from '../components/AddAttendantModal';
import ExportCsvButton from '../components/ExportCsvButton';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Info } from 'lucide-react';

export type EventAttentantListProps = {
  eventId?: string;
  attendants?: EventAttendant[];
  eventDescription?: string;
  endDate?: string;
};

export default function EventAttentantList({
  eventId,
  attendants,
  eventDescription,
  endDate,
}: EventAttentantListProps) {
  const { creator_admin: ca } = useDictionary();
  const { attendants: d } = ca;

  const anonymizationDate = endDate
    ? new Date(new Date(endDate).setMonth(new Date(endDate).getMonth() + 1))
    : null;

  return (
    <div>
      {anonymizationDate && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-4 py-3 mb-4">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span
            dangerouslySetInnerHTML={{
              __html: d.anonymization_notice.replace(
                '%date%',
                `<strong>${anonymizationDate.toLocaleDateString()}</strong>`
              ),
            }}
          />
        </div>
      )}
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
