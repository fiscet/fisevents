import { EventAttendant, Occurrence, SanityImageAsset, SanityImageDimensions, SanityImageMetadata } from '@/types/sanity.types';

export type OccurrenceList = Partial<Occurrence> & {
  numAttendants: number;
};

type ImageDimension = Pick<SanityImageMetadata, 'dimensions'>;

export type OccurrenceSingle = Partial<Occurrence> & {
  eventTypeCode: string;
  pageImage: Pick<SanityImageAsset, 'url'> & Pick<SanityImageMetadata, 'dimensions'>;
  subcribers: Pick<EventAttendant, 'fullName' | 'email'>;
};