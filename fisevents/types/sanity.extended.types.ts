import { EventAttendant, Occurrence, SanityImageAsset, SanityImageMetadata } from '@/types/sanity.types';

export type OccurrenceList = Partial<Occurrence> & {
  numAttendants: number;
};

export type OccurrenceSingle = Partial<Occurrence> & {
  pageImage: Pick<SanityImageAsset, 'url'> & Pick<SanityImageMetadata, 'dimensions'>;
  subcribers: Pick<EventAttendant, 'fullName' | 'email'>[];
};