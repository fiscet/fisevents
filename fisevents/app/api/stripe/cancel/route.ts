import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.cli';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const occurrenceId = searchParams.get('occurrenceId');
  const lang = searchParams.get('lang') ?? 'it';

  if (occurrenceId) {
    const doc = await sanityClient.fetch<string | null>(
      `*[_id == $id && pendingPayment == true][0]._id`,
      { id: occurrenceId }
    );
    if (doc) {
      await sanityClient.delete(occurrenceId);
    }
  }

  return NextResponse.redirect(new URL(`/${lang}/creator-admin/event`, req.nextUrl.origin));
}
