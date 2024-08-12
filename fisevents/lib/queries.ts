import { groq } from "next-sanity";

/** EVENT */
export const eventListQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy && active == $active ] {
  _id,
  title,
  slug,
  'eventTypeCode': eventType->code,
  startDate,
  endDate,
  publicationStartDate,
  'numAttendants': count(attendants)
}`;

export const eventSingleQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy && slug.current == $slug ][0] {
  _id,
  title,
  description,
  "eventTypeCode": eventType->code,
  "pageImage": {
    "url": mainImage.asset->url,
    "dimensions": mainImage.asset->metadata.dimensions
  },
  location,
  maxSubscribers,
  basicPrice,
  startDate,
  endDate,
  publicationStartDate,
  active,
  "subcribers": attendants[]->{
      fullName, 
      email
    }
}`;
