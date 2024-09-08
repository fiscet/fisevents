'use server';

import { sanityClient } from "./sanity";
import { eventListQuery, eventSingleQuery, organizationQuery, userQuery } from "./queries";
import { CurrentOrganization, CurrentUser, OccurrenceList, OccurrenceSingle } from "@/types/sanity.extended.types";
import { Occurrence, Organization, User } from "@/types/sanity.types";
import { revalidateTag } from "next/cache";

/** USERS */
export const getUser = async ({ userId }: { userId: string; }) => {
  return await sanityClient.fetch<CurrentUser>(userQuery, { userId }, { next: { tags: ['user'] } });
};

export const updateUser = async ({ id, data }: { id: string; data: Partial<User>; }) => {
  const res = await sanityClient
    .patch(id)
    .set(data)
    .commit();

  revalidateTag('user');

  return res;
};

/** ORGANIZATIONS */
export const getOrganization = async ({ organizationId }: { organizationId: string; }) => {
  return await sanityClient.fetch<CurrentOrganization>(organizationQuery, { organizationId }, { next: { tags: ['organization'] } });
};

export const createOrganization = async ({ data }: { data: Organization; }) => {
  const res = await sanityClient.create<Organization>(data);

  revalidateTag('organization');

  return res;
};

export const updateOrganization = async ({ id, data }: { id: string; data: Partial<Organization>; }) => {
  const res = await sanityClient.patch(id).set(data).commit();

  revalidateTag('organization');

  return res;
};

/** EVENTS */
export const getEventList = async ({ createdBy, active = true }: { createdBy: string; active?: boolean; }) => {
  return await sanityClient.fetch<OccurrenceList[]>(eventListQuery, { createdBy, active }, { next: { tags: ['eventList'] } });
};

export const getEventSingle = async ({ createdBy, slug }: { createdBy: string; slug: string; }) => {
  return await sanityClient.fetch<OccurrenceSingle>(eventSingleQuery, { createdBy, slug }, { next: { tags: ['eventSingle'] } });
};

export const updateEvent = async ({ id, data }: { id: string; data: Partial<Occurrence>; }) => {
  const res = await sanityClient.patch(id).set(data).commit();

  revalidateTag('eventSingle');

  return res;
};

export const createEvent = async ({ data }: { data: Occurrence; }) => {
  const res = await sanityClient.create<Occurrence>(data);

  revalidateTag('eventList');

  return res;
};
