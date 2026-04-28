import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sanityClient } from '@/lib/sanity.cli';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const userId = session.user!.uid as string;
  const email = session.user!.email as string;

  const [account, events] = await Promise.all([
    sanityClient.fetch(
      `*[_type == "user" && _id == $userId][0] {
        _id,
        name,
        email,
        companyName,
        "slug": slug.current,
        www,
        _createdAt,
        tosAcceptedAt
      }`,
      { userId }
    ),
    sanityClient.fetch(
      `*[_type == "occurrence" && createdByUser._ref == $userId] | order(startDate desc) {
        _id,
        title,
        "slug": slug.current,
        description,
        location,
        talkTo,
        maxSubscribers,
        basicPrice,
        currency,
        startDate,
        endDate,
        publicationStartDate,
        active,
        pendingPayment,
        attendantsAnonymizedAt,
        _createdAt,
        attendants[] {
          uuid,
          fullName,
          email,
          phone,
          subcribitionDate,
          checkedIn,
          paymentStatus,
          privacyAccepted
        }
      }`,
      { userId }
    ),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    account,
    events,
  };

  const filename = `fisevents-data-${email}-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
