import { sanityClient } from "./sanity";
import { eventListQuery } from "./queries";
import { Occurrence } from "@/types/sanity.types";

export const getEventList = async ({ createdBy }: { createdBy: string; }) => {
  return await sanityClient.fetch<Partial<Occurrence>[]>(eventListQuery, { createdBy });
};