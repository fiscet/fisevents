import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.cli';
import { expireOffer } from '@/lib/registrations';
import { notifyWaitlistPromotion } from '@/lib/waitlist-notify';
import type { Locale } from '@/lib/i18n';

const DEFAULT_LANG: Locale = 'it';

type ExpiredOffer = {
  _id: string;
  eventId: string;
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date().toISOString();

  const expiredOffers = await sanityClient.fetch<ExpiredOffer[]>(
    `*[_type == "registration" && status == "offered" && offerExpiresAt <= $now] {
      _id,
      "eventId": occurrence._ref
    }`,
    { now },
    { cache: 'no-store' }
  );

  const results: Array<{ registrationId: string; eventId: string; promoted: boolean; error?: string }> = [];

  for (const offer of expiredOffers) {
    try {
      const promoted = await expireOffer({ eventId: offer.eventId, registrationId: offer._id });
      if (promoted) {
        await notifyWaitlistPromotion({ eventId: offer.eventId, promoted, lang: DEFAULT_LANG });
      }
      results.push({ registrationId: offer._id, eventId: offer.eventId, promoted: !!promoted });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Waitlist expiry failed for registration ${offer._id}:`, err);
      results.push({ registrationId: offer._id, eventId: offer.eventId, promoted: false, error: message });
    }
  }

  return NextResponse.json({ checked: expiredOffers.length, results });
}
