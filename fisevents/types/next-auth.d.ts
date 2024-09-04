import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid: string;
    } & DefaultSession["user"];
  }
}