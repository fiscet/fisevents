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
  slug,
  www,
  image,
  "imageUrl": image.asset->url
}`;

export const organizationCountBySlugQuery = groq`count(*[_type == "organization" && slug.current == $slug && active == true])`;

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

export const eventSingleBySlugQuery = groq`*[_type == "occurrence" && slug.current == $eventSlug && active == true && publicationStartDate <= now()][0] {
  _id,
  title,
  slug,
  description,
  "pageImage": {
    "url": mainImage.asset->url,
    "dimensions": mainImage.asset->metadata.dimensions
  },
  location,
  "remainingPlaces": maxSubscribers-count(attendants),
  "price": coalesce(string(basicPrice), "") + " " + coalesce(currency, "EUR"),
  startDate,
  endDate,
  "organizationSlug":*[_type == "organization" && _id == ^.createdByUser->organization->_id][0].slug.current,
}`;