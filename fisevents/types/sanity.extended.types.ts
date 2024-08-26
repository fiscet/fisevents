import { EventAttendant, Occurrence, SanityImageAsset, SanityImageMetadata } from '@/types/sanity.types';

export type OccurrenceList = Partial<Occurrence> & {
  eventTypeCode: string;
  numAttendants: number;
};

export type OccurrenceSingle = Partial<Occurrence> & {
  eventTypeCode: string;
  pageImage: Pick<SanityImageAsset, 'url'> & Pick<SanityImageMetadata, 'dimensions'>;
  subcribers: Pick<EventAttendant, 'fullName' | 'email'>[];
};