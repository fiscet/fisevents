import { defineQuery } from "next-sanity";

/** USERS and ORGANIZATIONS */
export const userQuery = defineQuery(`*[_type == "user" && _id == $userId][0] {
  _id,
  name,
  email,
  image,
  roles,
  "curOrganization": organization->{
    _id,
    companyName,
    "companySlug": slug.current
  }
}`);

export const organizationQuery = defineQuery(`*[_type == "organization" && _id == $organizationId][0] {
  _id,
  companyName,
  slug,
  www,
  image,
  "imageUrl": image.asset->url
}`);
export const organizationBySlugQuery = defineQuery(`*[_type == "organization" && slug.current == $organizationSlug][0] {
  _id,
  companyName,
  www,
  "imageUrl": image.asset->url
}`);

export const organizationCountBySlugQuery = defineQuery(`count(*[_type == "organization" && slug.current == $slug && active == true])`);

/** EVENTS */
export const eventListQuery = defineQuery(`*[_type == "occurrence" && createdByUser._ref == $createdBy && active == $active ]|order(publicationStartDate desc) {
  _id,
  title,
  slug,
  startDate,
  endDate,
  publicationStartDate,
  'numAttendants': count(attendants),
  active
}`);

export const eventSingleByIdQuery = defineQuery(`*[_type == "occurrence" && createdByUser._ref == $createdBy && _id == $id ][0] {
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
}`);

export const eventSingleBySlugQuery = defineQuery(`
*[
  _type == "occurrence" && 
  slug.current == $eventSlug && 
  active == true && 
  publicationStartDate <= now() && 
  endDate >= now()
  ][0] {
  _id,
  title,
  description,
  "pageImage": {
    "url": mainImage.asset->url,
    "dimensions": mainImage.asset->metadata.dimensions
  },
  location,
  "remainingPlaces": maxSubscribers-count(attendants),
  "price": coalesce(string(basicPrice), "") + " " + coalesce(currency, "-"),
  startDate,
  endDate,
  "organizationSlug":*[_type == "organization" && _id == ^.createdByUser->organization->_id][0].slug.current,
}`);

export const eventSingleHasAttendantByEmailQuery = defineQuery(`
*[
  _type == "occurrence" && 
  _id == $eventId 
  ][0] {
  "hasAttendant":count(attendants[email match $email]) > 0
}`);

export const eventSingleHasAttendantByUuidQuery = defineQuery(`
*[
  _type == "occurrence" && 
  _id == $eventId 
  ][0] {
  "hasAttendant":count(attendants[uuid match $uuid]) > 0
}`);