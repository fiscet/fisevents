'use server';

import { sanityClient } from "./sanity";
import { eventListQuery, eventSingleQuery } from "./queries";
import { OccurrenceList, OccurrenceSingle } from "@/types/sanity.extended.types";
import { Occurrence } from "@/types/sanity.types";
import { revalidateTag } from "next/cache";

export const getEventList = async ({ createdBy, active = true }: { createdBy: string; active?: boolean; }) => {
  return await sanityClient.fetch<OccurrenceList[]>(eventListQuery, { createdBy, active });
};

export const getEventSingle = async ({ createdBy, slug }: { createdBy: string; slug: string; }) => {
  return await sanityClient.fetch<OccurrenceSingle>(eventSingleQuery, { createdBy, slug }, { next: { tags: ['eventSingle'] } });
};

export const updateEvent = async ({ id, data }: { id: string; data: Partial<Occurrence>; }) => {
  const res = await sanityClient
    .patch(id)
    .set(data)
    .commit();

  // revalidateTag('eventSingle');

  return res;
};
