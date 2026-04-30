import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import arcjet, { slidingWindow, validateEmail } from '@/lib/arcjet';

const handler = NextAuth(authOptions);

const ajAuth = arcjet
  .withRule(
    slidingWindow({
      mode: 'LIVE',
      interval: '1h',
      max: 5
    })
  )
  .withRule(
    slidingWindow({
      mode: 'LIVE',
      interval: '1h',
      max: 3,
      characteristics: ['email']
    })
  )
  .withRule(
    validateEmail({
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS']
    })
  );

type NextAuthCtx = { params: Promise<{ nextauth: string[] }> };

async function POST(req: NextRequest, ctx: NextAuthCtx) {
  const { nextauth } = await ctx.params;
  const isSigninEmail =
    nextauth?.[0] === 'signin' && nextauth?.[1] === 'email';

  if (isSigninEmail) {
    const cloned = req.clone();
    const formData = await cloned.formData();
    const email = String(formData.get('email') ?? '');

    const decision = await ajAuth.protect(req, { email });
    if (decision.isDenied()) {
      const errorUrl = new URL('/api/auth/error?error=AccessDenied', req.url);
      return NextResponse.redirect(errorUrl, 303);
    }
  }

  return handler(req, ctx);
}

export { handler as GET, POST };
