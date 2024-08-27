import { DefaultSession } from "next-auth";

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

export const NOTIFICATION_TYPES = ['success', 'error', 'info', 'warning', 'none'] as const;

export type Notification = {
  title?: string;
  message: string;
  type: typeof NOTIFICATION_TYPES[number];
};