import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import Email from 'next-auth/providers/email';
import { SanityAdapter } from 'next-auth-sanity';
import { sanityClient } from '@/lib/sanity';
import { FDefaultSession } from '@/types/custom.types';

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  adapter: SanityAdapter(sanityClient),
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ token, session }: { token: JWT, session: FDefaultSession; }) {
      if (token) {
        session.user!.uid = token.sub || "";
        session.user!.name = token.name;
        session.user!.email = token.email;
        session.user!.image = token.picture;
      }
      return session;
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
        token.image = session.image;
      }
      return token;
    }
  },
} satisfies NextAuthOptions;