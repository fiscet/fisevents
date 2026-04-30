import { EventAttendant, Occurrence, SanityImageAsset, SanityImageMetadata, User } from '@/types/sanity.types';
import { PortableTextBlock } from '@portabletext/react';

type LocalizedString = { it?: string; en?: string } | null;
type LocalizedText = { it?: string; en?: string } | null;

export type LandingPageItem = {
  icon?: string;
  title?: LocalizedString;
  description?: LocalizedText;
};

export type LandingPage = {
  title: string;
  slug: string;
  coverImageUrl?: string | null;
  heroHeadline?: LocalizedString;
  heroSubheadline?: LocalizedText;
  heroCtaLabel?: LocalizedString;
  painPoints?: LandingPageItem[];
  features?: LandingPageItem[];
  bodyIt?: PortableTextBlock[];
  bodyEn?: PortableTextBlock[];
  seoTitleIt?: string;
  seoDescriptionIt?: string;
  seoTitleEn?: string;
  seoDescriptionEn?: string;
  _updatedAt: string;
};

export type CurrentUser = Partial<User> & {
  logoUrl: Pick<SanityImageAsset, 'url'>['url'];
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
  companyName: string;
  organizationSlug: string;
  organizerEmail: string;
};

export type OrgPublicEvent = {
  _id: string;
  title: string;
  publicSlug: string;
  pageImage: {
    url: string | null;
    dimensions: Pick<SanityImageMetadata['dimensions'], never> & {
      width?: number;
      height?: number;
      aspectRatio?: number;
    } | null;
  };
  startDate: string;
  endDate: string;
  location?: string;
  maxSubscribers?: number;
  remainingPlaces: number;
  price: string;
};

