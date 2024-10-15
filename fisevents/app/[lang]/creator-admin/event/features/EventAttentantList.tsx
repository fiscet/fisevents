import { getDictionary } from '@/lib/i18n.utils';
import { EventAttendant } from '@/types/sanity.types';
import EventAttentantTable from './EventAttentantTable';
import EventAttentantCards from './EventAttentantCards';

export type EventAttentantListProps = {
  attendants?: EventAttendant[];
  eventDescription?: string;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['attendants'];
};

export default function EventAttentantList({
  attendants,
  eventDescription,
  dictionary
}: EventAttentantListProps) {
  return (
    <div>
      <div className="mb-2 text-center">
        <h2 className="uppercase font-medium text-xl">
          {attendants?.length} {dictionary.attendants}
        </h2>
        <h3 className="italic text-lg">{eventDescription}</h3>
      </div>
      <EventAttentantTable
        attendants={attendants}
        eventDescription={eventDescription}
        dictionary={dictionary}
      />
      <EventAttentantCards
        attendants={attendants}
        eventDescription={eventDescription}
        dictionary={dictionary}
      />
    </div>
  );
}
