import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.cli';

type EventToAnonymize = {
  _id: string;
  attendants: Array<{
    _key: string;
    _type: string;
    uuid?: string;
    subcribitionDate?: string;
    checkedIn?: boolean;
    paymentStatus?: string;
    privacyAccepted?: boolean;
  }>;
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const events = await sanityClient.fetch<EventToAnonymize[]>(
    `*[
      _type == "occurrence"
      && endDate < $cutoff
      && !defined(attendantsAnonymizedAt)
      && count(attendants) > 0
    ] {
      _id,
      attendants[] {
        _key,
        _type,
        uuid,
        subcribitionDate,
        checkedIn,
        paymentStatus,
        privacyAccepted
      }
    }`,
    { cutoff: oneMonthAgo.toISOString() }
  );

  const results: Array<{ eventId: string; anonymized: number; error?: string }> = [];

  for (const ev of events) {
    try {
      const anonymizedAttendants = ev.attendants.map((a) => ({
        _type: a._type,
        _key: a._key,
        uuid: a.uuid,
        subcribitionDate: a.subcribitionDate,
        checkedIn: a.checkedIn ?? false,
        paymentStatus: a.paymentStatus ?? 'na',
        privacyAccepted: a.privacyAccepted ?? true,
        fullName: null,
        email: null,
        phone: null,
      }));

      await sanityClient
        .patch(ev._id)
        .set({
          attendants: anonymizedAttendants,
          attendantsAnonymizedAt: new Date().toISOString(),
        })
        .commit();

      results.push({ eventId: ev._id, anonymized: ev.attendants.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Anonymization failed for event ${ev._id}:`, err);
      results.push({ eventId: ev._id, anonymized: 0, error: message });
    }
  }

  return NextResponse.json({ processed: events.length, results });
}
