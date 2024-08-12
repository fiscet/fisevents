import { sanityClient } from "./sanity";
import { eventListQuery, eventSingleQuery } from "./queries";
import { OccurrenceList, OccurrenceSingle } from "@/types/sanity.extended.types";

export const getEventList = async ({ createdBy, active }: { createdBy: string; active: boolean; }) => {
  if (!active && active !== false) {
    active = true;
  }

  return await sanityClient.fetch<OccurrenceList[]>(eventListQuery, { createdBy, active });
};

export const getEventSingle = async ({ createdBy, slug }: { createdBy: string; slug: string; }) => {
  return await sanityClient.fetch<OccurrenceSingle>(eventSingleQuery, { createdBy, slug });
};