import { sanityClient } from "./sanity";
import { eventListQuery } from "./queries";
import { OccurrenceList } from "@/types/sanity.extended.types";

export const getEventList = async ({ createdBy, active }: { createdBy: string; active: boolean; }) => {
  if (!active && active !== false) {
    active = true;
  }

  return await sanityClient.fetch<OccurrenceList[]>(eventListQuery, { createdBy, active });
};