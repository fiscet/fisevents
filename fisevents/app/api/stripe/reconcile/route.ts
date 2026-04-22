import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sanityClient } from '@/lib/sanity.cli';
import { revalidateTag } from 'next/cache';

type PendingEvent = {
  _id: string;
  stripeSessionId: string;
  _createdAt: string;
};

async function logPaymentEvent(data: {
  stripeEventId: string;
  eventType: string;
  occurrenceId?: string;
  sessionId?: string;
  status: 'received' | 'processed' | 'failed' | 'skipped';
  errorMessage?: string;
  amount?: number;
  currency?: string;
}) {
  try {
    await sanityClient.create({
      _type: 'paymentEvent',
      receivedAt: new Date().toISOString(),
      ...data,
    });
  } catch (err) {
    console.error('Failed to log paymentEvent:', err);
  }
}

async function alreadyReconciled(sessionId: string): Promise<boolean> {
  const existing = await sanityClient.fetch<string | null>(
    `*[_type == "paymentEvent" && sessionId == $sid && status == "processed"][0]._id`,
    { sid: sessionId }
  );
  return !!existing;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const pending = await sanityClient.fetch<PendingEvent[]>(
    `*[_type == "occurrence" && pendingPayment == true && defined(stripeSessionId) && _createdAt < $cutoff] {
      _id,
      stripeSessionId,
      _createdAt
    }`,
    { cutoff }
  );

  const results: Array<{ occurrenceId: string; action: string; error?: string }> = [];

  for (const occ of pending) {
    try {
      if (await alreadyReconciled(occ.stripeSessionId)) {
        results.push({ occurrenceId: occ._id, action: 'already-processed' });
        continue;
      }

      const session = await stripe.checkout.sessions.retrieve(occ.stripeSessionId);
      const eventBase = {
        stripeEventId: `reconcile_${occ.stripeSessionId}`,
        eventType: 'reconciliation',
        occurrenceId: occ._id,
        sessionId: occ.stripeSessionId,
        amount: session.amount_total ?? undefined,
        currency: session.currency ?? undefined,
      };

      if (session.payment_status === 'paid') {
        await sanityClient
          .patch(occ._id)
          .set({ active: true, pendingPayment: false })
          .commit();
        revalidateTag('eventList');
        revalidateTag(`eventSingle:${occ._id}`);
        await logPaymentEvent({ ...eventBase, status: 'processed' });
        results.push({ occurrenceId: occ._id, action: 'recovered-paid' });
      } else if (session.status === 'expired') {
        await sanityClient.delete(occ._id);
        revalidateTag('eventList');
        await logPaymentEvent({
          ...eventBase,
          status: 'processed',
          errorMessage: 'Session expired, pending event removed',
        });
        results.push({ occurrenceId: occ._id, action: 'removed-expired' });
      } else {
        results.push({
          occurrenceId: occ._id,
          action: `skipped-${session.payment_status ?? session.status}`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await logPaymentEvent({
        stripeEventId: `reconcile_${occ.stripeSessionId}`,
        eventType: 'reconciliation',
        occurrenceId: occ._id,
        sessionId: occ.stripeSessionId,
        status: 'failed',
        errorMessage: message,
      });
      results.push({ occurrenceId: occ._id, action: 'error', error: message });
    }
  }

  return NextResponse.json({ checked: pending.length, results });
}
