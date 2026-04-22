import { stripe } from '@/lib/stripe';
import { sanityClient } from '@/lib/sanity.cli';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { sendMail } from '@/lib/send-mail';
import { eventForWebhookQuery } from '@/lib/queries';

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

      const eventInfo = await sanityClient.fetch(eventForWebhookQuery, { occurrenceId });

      if (eventInfo?.creatorEmail) {
        const subject = `Pagamento confermato - ${eventInfo.title ?? 'Evento'}`;
        const creatorName = eventInfo.creatorName ?? '';
        const eventTitle = eventInfo.title ?? '';

        await sendMail({
          sendTo: eventInfo.creatorEmail,
          subject,
          text: `Ciao ${creatorName},\n\nIl pagamento per la pubblicazione dell'evento "${eventTitle}" è stato confermato con successo.\n\nL'evento è ora attivo e visibile al pubblico.\n\nCordiali saluti,\nFisEvents`,
          html: `<h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Pagamento confermato!</h2><p style="margin:0 0 12px;">Ciao <strong>${creatorName}</strong>,</p><p style="margin:0 0 16px;">Il pagamento per la pubblicazione dell'evento <strong>${eventTitle}</strong> è stato ricevuto correttamente.</p><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin:20px 0;"><tr><td style="padding:20px;"><p style="margin:0;font-size:15px;color:#166534;">✅ Il tuo evento è ora attivo e visibile al pubblico.</p></td></tr></table><p style="margin:20px 0 0;color:#555f6f;">Grazie per usare FisEvents.<br><strong>Il team FisEvents</strong></p>`,
        });
      }
    }
  }

  return new Response(null, { status: 200 });
}
