import { defineQuery } from 'next-sanity';

/** USERS and ORGANIZATIONS */
export const userQuery = defineQuery(`*[_type == "user" && _id == $userId][0] {
  _id,
  name,
  image,
  companyName,
  slug,
  email,
  logo,
  "logoUrl": logo.asset->url,
  wwww,
  roles
}`);
export const userQueryBySlug = defineQuery(`*[_type == "user" && slug.current == $slug][0] {
  name,
  companyName,
  email,
  "logoUrl": logo.asset->url,
  wwww
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

export const organizationCountBySlugQuery = defineQuery(
  `count(*[_type == "organization" && slug.current == $slug && active == true])`
);

/** EVENTS */
export const eventIdQuery = defineQuery(`*[_type == "occurrence" && active == $active && publicationStartDate <= now() && endDate >= now()]|order(publicationStartDate desc) {
 _id
}`);

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
  publicSlug,
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
  publicSlug == $publicSlug && 
  active == true
  ][0] {
  _id,
  title,
  description,
  "pageImage": {
    "url": mainImage.asset->url,
    "dimensions": mainImage.asset->metadata.dimensions
  },
  location,
  maxSubscribers,
  "remainingPlaces": maxSubscribers-(coalesce(count(attendants), 0)),
  "price": select(
    length(currency) > 0 && basicPrice > 0 =>coalesce(string(basicPrice), "") + " " + coalesce(currency, "-"),
    basicPrice > 0 => coalesce(string(basicPrice), ""),
    ""
  ),
  startDate,
  endDate,
  "companyName":*[_type == "user" && _id == ^.createdByUser->_id][0].companyName,
  "organizationSlug":*[_type == "user" && _id == ^.createdByUser->_id][0].slug.current,
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
