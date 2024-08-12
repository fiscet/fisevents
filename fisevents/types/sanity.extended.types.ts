import { Occurrence } from '@/types/sanity.types';

export type OccurrenceList = Partial<Occurrence> & {
  numAttendants: number;
};