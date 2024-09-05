import { groq } from "next-sanity";

/** EVENT */
export const eventListQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy && active == $active ]|order(publicationStartDate desc) {
  _id,
  title,
  slug,
  startDate,
  endDate,
  publicationStartDate,
  'numAttendants': count(attendants),
  active
}`;

export const eventSingleQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy && slug.current == $slug ][0] {
  _id,
  title,
  slug,
  description,
  "pageImage": {
    "url": mainImage.asset->url,
    "dimensions": mainImage.asset->metadata.dimensions
  },
  location,
  maxSubscribers,
  basicPrice,
  currency,
  startDate,
  endDate,
  publicationStartDate,
  active,
  attendants
}`;
