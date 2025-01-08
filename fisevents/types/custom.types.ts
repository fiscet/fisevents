import { DefaultSession } from "next-auth";

export const NOTIFICATION_TYPES = ['success', 'error', 'info', 'warning', 'none'] as const;
export const EVENT_STATUS = ['published', 'registrations_open', 'finished'] as const;
export const EVENT_FILTERS = ['all', ...EVENT_STATUS] as const;

export interface FDefaultSession extends DefaultSession {
  user?: {
    uid?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export type FileImageType = {
  file: File;
  imgUrl: string;
};

export type Notification = {
  title?: string;
  message: string;
  type: typeof NOTIFICATION_TYPES[number];
};

export type EventStatusType = typeof EVENT_STATUS[number];
export type EventFilterType = typeof EVENT_FILTERS[number];