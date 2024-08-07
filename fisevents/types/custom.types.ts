import { DefaultSession } from "next-auth";

export interface FDefaultSession extends DefaultSession {
  user?: {
    uid?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
