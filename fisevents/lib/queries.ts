import { groq } from "next-sanity";


/** USERS and ORGANIZATIONS */
export const userQuery = groq`*[_type == "user" && _id == $userId][0] {
  _id,
  name,
  email,
  image,
  roles,
  "curOrganization": organization->{
    _id,
    companyName
  }
}`;

export const organizationQuery = groq`*[_type == "organization" && _id == $organizationId][0] {
  _id,
  companyName,
  www,
  image,
  "imageUrl": image.asset->url
}`;


/** EVENTS */
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

export const eventSingleByIdQuery = groq`*[_type == "occurrence" && createdByUser._ref == $createdBy && _id == $id ][0] {
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
