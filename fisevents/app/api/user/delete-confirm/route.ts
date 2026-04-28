import { NextRequest, NextResponse } from 'next/server';
import { verifyDeleteAccountToken } from '@/lib/delete-account-token';
import { sanityClient } from '@/lib/sanity.cli';

export async function GET(request: NextRequest) {
  const t = request.nextUrl.searchParams.get('t') ?? '';
  const payload = verifyDeleteAccountToken(t);

  if (!payload) {
    return NextResponse.redirect(new URL('/api/auth/signout?callbackUrl=/', request.url));
  }

  const { userId, email, lang } = payload;

  try {
    const [accounts, verificationTokens, occurrences] = await Promise.all([
      sanityClient.fetch<{ _id: string }[]>(
        `*[_type == "account" && userId == $userId]{_id}`,
        { userId }
      ),
      sanityClient.fetch<{ _id: string }[]>(
        `*[_type == "verificationToken" && identifier == $email]{_id}`,
        { email }
      ),
      sanityClient.fetch<{ _id: string }[]>(
        `*[_type == "occurrence" && createdByUser._ref == $userId]{_id}`,
        { userId }
      ),
    ]);

    const tx = sanityClient.transaction();
    [...accounts, ...verificationTokens, ...occurrences].forEach((doc) =>
      tx.delete(doc._id)
    );
    tx.delete(userId);
    await tx.commit();
  } catch {
    return NextResponse.redirect(new URL('/api/auth/signout?callbackUrl=/', request.url));
  }

  return NextResponse.redirect(
    new URL(`/${lang}/account-deleted`, request.url)
  );
}
