import { groq } from "next-sanity";

/** EVENT */
export const eventListQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy ] {
  _id,
  title,
  slug,
  'eventTypeCode': eventType->code,
  startDate,
  endDate,
  publicationStartDate
}`;

export const eventSingleQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy && _id == $eventId ][0]`;
