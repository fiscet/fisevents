import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.cli';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const events = await sanityClient.fetch<{ _id: string }[]>(
    `*[
      _type == "occurrence"
      && !(_id in path("drafts.**"))
      && endDate < $cutoff
      && !defined(attendantsAnonymizedAt)
      && count(*[_type == "registration" && occurrence._ref == ^._id]) > 0
    ]{ _id }`,
    { cutoff: oneMonthAgo.toISOString() }
  );

  const results: Array<{ eventId: string; anonymized: number; error?: string }> = [];

  for (const ev of events) {
    try {
      const registrationIds = await sanityClient.fetch<string[]>(
        `*[_type == "registration" && occurrence._ref == $id]._id`,
        { id: ev._id }
      );

      const tx = sanityClient.transaction();
      // Null out personal data; custom field answers may contain PII → drop them.
      registrationIds.forEach((id) =>
        tx.patch(id, (p) =>
          p.set({
            fullName: null,
            email: null,
            phone: null,
            customFieldValues: [],
          })
        )
      );
      tx.patch(ev._id, (p) =>
        p.set({ attendantsAnonymizedAt: new Date().toISOString() })
      );
      await tx.commit();

      results.push({ eventId: ev._id, anonymized: registrationIds.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Anonymization failed for event ${ev._id}:`, err);
      results.push({ eventId: ev._id, anonymized: 0, error: message });
    }
  }

  return NextResponse.json({ processed: events.length, results });
}
