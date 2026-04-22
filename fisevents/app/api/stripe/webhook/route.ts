import { stripe } from '@/lib/stripe';
import { sanityClient } from '@/lib/sanity.cli';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { sendMail } from '@/lib/send-mail';
import { eventForWebhookQuery } from '@/lib/queries';

const HANDLED_EVENTS = [
  'checkout.session.completed',
  'checkout.session.expired',
] as const;

type HandledEventType = (typeof HANDLED_EVENTS)[number];

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

async function isAlreadyProcessed(stripeEventId: string): Promise<boolean> {
  const existing = await sanityClient.fetch<string | null>(
    `*[_type == "paymentEvent" && stripeEventId == $id && status == "processed"][0]._id`,
    { id: stripeEventId }
  );
  return !!existing;
}

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

  if (!HANDLED_EVENTS.includes(event.type as HandledEventType)) {
    return new Response(null, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const occurrenceId = session.metadata?.occurrenceId;
  const eventBase = {
    stripeEventId: event.id,
    eventType: event.type,
    occurrenceId,
    sessionId: session.id,
    amount: session.amount_total ?? undefined,
    currency: session.currency ?? undefined,
  };

  if (await isAlreadyProcessed(event.id)) {
    await logPaymentEvent({ ...eventBase, status: 'skipped', errorMessage: 'Duplicate event' });
    return new Response(null, { status: 200 });
  }

  if (!occurrenceId) {
    await logPaymentEvent({ ...eventBase, status: 'failed', errorMessage: 'Missing occurrenceId' });
    return new Response(null, { status: 200 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await sanityClient
        .patch(occurrenceId)
        .set({ active: true, pendingPayment: false, stripeSessionId: session.id })
        .commit();

      revalidateTag('eventList');
      revalidateTag(`eventSingle:${occurrenceId}`);

      const eventInfo = await sanityClient.fetch(eventForWebhookQuery, { occurrenceId });

      if (eventInfo?.creatorEmail) {
        const creatorName = eventInfo.creatorName ?? '';
        const eventTitle = eventInfo.title ?? '';

        void sendMail({
          sendTo: eventInfo.creatorEmail,
          subject: `Pagamento confermato - ${eventTitle || 'Evento'}`,
          text: `Ciao ${creatorName},\n\nIl pagamento per la pubblicazione dell'evento "${eventTitle}" è stato confermato con successo.\n\nL'evento è ora attivo e visibile al pubblico.\n\nCordiali saluti,\nFisEvents`,
          html: `<h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Pagamento confermato!</h2><p style="margin:0 0 12px;">Ciao <strong>${creatorName}</strong>,</p><p style="margin:0 0 16px;">Il pagamento per la pubblicazione dell'evento <strong>${eventTitle}</strong> è stato ricevuto correttamente.</p><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin:20px 0;"><tr><td style="padding:20px;"><p style="margin:0;font-size:15px;color:#166534;">✅ Il tuo evento è ora attivo e visibile al pubblico.</p></td></tr></table><p style="margin:20px 0 0;color:#555f6f;">Grazie per usare FisEvents.<br><strong>Il team FisEvents</strong></p>`,
        }).catch((err) => {
          console.error('Payment confirmation email failed:', err);
        });
      }
    } else if (event.type === 'checkout.session.expired') {
      const stillPending = await sanityClient.fetch<string | null>(
        `*[_id == $id && pendingPayment == true][0]._id`,
        { id: occurrenceId }
      );
      if (stillPending) {
        await sanityClient.delete(occurrenceId);
        revalidateTag('eventList');
      }
    }

    await logPaymentEvent({ ...eventBase, status: 'processed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logPaymentEvent({ ...eventBase, status: 'failed', errorMessage: message });
    console.error('Webhook processing failed:', err);
    return new Response('Internal error', { status: 500 });
  }

  return new Response(null, { status: 200 });
}
