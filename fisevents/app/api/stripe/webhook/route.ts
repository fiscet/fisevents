import { stripe } from '@/lib/stripe';
import { sanityClient } from '@/lib/sanity.cli';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');

  if (!sig) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const occurrenceId = session.metadata?.occurrenceId;

    if (occurrenceId) {
      await sanityClient
        .patch(occurrenceId)
        .set({ active: true, pendingPayment: false, stripeSessionId: session.id })
        .commit();

      revalidateTag('eventList');
      revalidateTag(`eventSingle:${occurrenceId}`);
    }
  }

  return new Response(null, { status: 200 });
}
