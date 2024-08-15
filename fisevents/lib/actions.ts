'use server';

import { sanityClient } from "./sanity";
import { eventListQuery, eventSingleQuery } from "./queries";
import { OccurrenceList, OccurrenceSingle } from "@/types/sanity.extended.types";
import { Occurrence } from "@/types/sanity.types";
import { createReadStream } from "fs";
import { basename } from "path";

export const getEventList = async ({ createdBy, active }: { createdBy: string; active: boolean; }) => {
  if (!active && active !== false) {
    active = true;
  }

  return await sanityClient.fetch<OccurrenceList[]>(eventListQuery, { createdBy, active });
};

export const getEventSingle = async ({ createdBy, slug }: { createdBy: string; slug: string; }) => {
  return await sanityClient.fetch<OccurrenceSingle>(eventSingleQuery, { createdBy, slug });
};

export const updateEvent = async ({ id, data }: { id: string; data: Partial<Occurrence>; }) => {
  return await sanityClient
    .patch(id)
    .set(data)
    .commit();
};
