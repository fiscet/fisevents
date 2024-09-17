'use server';

import { sanityClient } from "./sanity";
import { eventListQuery, eventSingleByIdQuery, organizationCountBySlugQuery, organizationQuery, userQuery } from "./queries";
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
  return await sanityClient.fetch<CurrentOrganization>(organizationQuery, { organizationId }, { next: { tags: [`organization:${organizationId}`] } });
};

export const getOrganizationCountBySlug = async ({ slug }: { slug: string; }) => {
  return await sanityClient.fetch<number>(organizationCountBySlugQuery, { slug }, { next: { tags: [`organizationCountBySlug:${slug}`] } });
};

export const createOrganization = async ({ data }: { data: Organization; }) => {
  const res = await sanityClient.create<Organization>(data);

  return res;
};

export const updateOrganization = async ({ id, data }: { id: string; data: Partial<Organization>; }) => {
  const res = await sanityClient.patch(id).set(data).commit();

  revalidateTag(`organization:${id}`);

  return res;
};

/** EVENTS */
export const getEventList = async ({ createdBy, active = true }: { createdBy: string; active?: boolean; }) => {
  return await sanityClient.fetch<OccurrenceList[]>(eventListQuery, { createdBy, active }, { next: { tags: ['eventList'] } });
};

export const getEventSingleById = async ({ createdBy, id }: { createdBy: string; id: string; }) => {
  return await sanityClient.fetch<OccurrenceSingle>(eventSingleByIdQuery, { createdBy, id }, { next: { tags: [`eventSingle:${id}`] } });
};

export const updateEvent = async ({ id, data }: { id: string; data: Partial<Occurrence>; }) => {
  const res = await sanityClient.patch(id).set(data).commit();

  revalidateTag(`eventSingle:${id}`);

  return res;
};

export const createEvent = async ({ data }: { data: Occurrence; }) => {
  const res = await sanityClient.create<Occurrence>(data);

  revalidateTag('eventList');

  return res;
};
