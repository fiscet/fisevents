'use server';

import { sanityClient } from "./sanity";
import { eventListQuery, eventSingleQuery } from "./queries";
import { OccurrenceList, OccurrenceSingle } from "@/types/sanity.extended.types";
import { Occurrence, User } from "@/types/sanity.types";
import { revalidateTag } from "next/cache";

/** USERS */
export const updateUser = async ({ id, data }: { id: string; data: Partial<User>; }) => {
  const res = await sanityClient
    .patch(id)
    .set(data)
    .commit();

  revalidateTag('user');

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
  const res = await sanityClient
    .patch(id)
    .set(data)
    .commit();

  revalidateTag('eventSingle');

  return res;
};

export const createEvent = async ({ data }: { data: Occurrence; }) => {
  const res = await sanityClient.create<Occurrence>(data);

  revalidateTag('eventList');

  return res;
};
