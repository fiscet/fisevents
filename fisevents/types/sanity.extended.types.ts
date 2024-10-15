import { EventAttendant, Occurrence, Organization, SanityImageAsset, SanityImageMetadata, User } from '@/types/sanity.types';

export type CurrentUser = Partial<User> & {
  curOrganization?: Partial<Organization> & {
    companySlug: string;
  };
};

export type CurrentOrganization = Partial<Organization> & {
  imageUrl: Pick<SanityImageAsset, 'url'>['url'];
};

export type OccurrenceList = Partial<Occurrence> & {
  numAttendants: number;
};

export type OccurrenceSingle = Partial<Occurrence> & {
  pageImage: Pick<SanityImageAsset, 'url'> & Pick<SanityImageMetadata, 'dimensions'>;
  subcribers: Pick<EventAttendant, 'fullName' | 'email'>[];
};


export type PublicOccurrenceSingle = Partial<Occurrence> & {
  pageImage: Pick<SanityImageAsset, 'url'> & Pick<SanityImageMetadata, 'dimensions'>;
  remainingPlaces: number;
  price: string;
  organizationSlug: string;
};

