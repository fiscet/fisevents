import { getServerSession, NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Email from 'next-auth/providers/email';
import { SanityAdapter } from 'next-auth-sanity';
import { sanityClient } from '@/lib/sanity.cli';
import { FDefaultSession } from '@/types/custom.types';

/**
 * The adapter looks users up by email. With the default `raw` perspective a
 * draft copy of a user (created by editing the doc in the Studio) sorts before
 * the published one, so the session id became `drafts.user.<uuid>` and every
 * document written with it referenced a draft. Reading published-only keeps the
 * adapter on the real user documents.
 */
const authSanityClient = sanityClient.withConfig({
  perspective: 'published',
  useCdn: false,
});

const toPublishedId = (id: string) => id.replace(/^drafts\./, '');

export const authOptions = {
  providers: [
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: SanityAdapter(authSanityClient),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({
      token,
      session,
    }: {
      token: JWT;
      session: FDefaultSession;
    }) {
      if (token) {
        session.user!.uid = toPublishedId(token.sub || '');
        session.user!.name = token.name;
        session.user!.email = token.email;
        session.user!.image = token.picture;
      }
      return session;
    },
    jwt({ token, trigger, session }) {
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
        token.image = session.image;
      }
      return token;
    },
  },
} satisfies NextAuthOptions;

export const getSession = async () => {
  return await getServerSession(authOptions);
};
