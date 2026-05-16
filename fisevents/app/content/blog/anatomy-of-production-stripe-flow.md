---
slug: anatomy-of-production-stripe-flow
title: "Anatomy of a production Stripe flow"
description: "Every Stripe tutorial ends at the happy path. Real payment flows handle webhook failures, expired sessions, reconciliation crons, and the parts no tutorial covers."
publishedAt: 2026-06-04
seriesOrder: 6
---


Every Stripe tutorial ends at the same place. You create a Checkout Session, redirect the user to it, redirect them back on success. The user has paid. The tutorial congratulates you.

That is not a payment flow. That is the happy path of a payment flow.

A production payment flow is what happens when:

- The user pays but never gets redirected back, because they closed the tab, the network died, the browser crashed.
- The user starts checkout, walks away, the session expires, and they come back three days later to try again.
- Stripe sends the webhook successfully, but the server is mid-deploy and misses it.
- Stripe retries the webhook, the first one actually went through, and naive code now double-credits the user.
- The user disputes the charge two weeks after the event is published.

None of those scenarios are in the Stripe quickstart. All of them are in production.

**Scope first.** In FisEvents, the payment flow is **creator → platform**: a creator pays €4.70 to publish an additional event past their monthly free one. There is no marketplace — attendees pay creators directly, outside the platform. That decision shrinks the regulatory surface enormously (no money transmission, no KYC chain to manage, no marketplace facilitator status). It also means the entire payment system has exactly one buyer-seller pair: the creator and FisEvents.

That makes the integration tractable for one developer. It does not make it small.

**The four parts:**

1. **Checkout Session creation.** A server-side endpoint that creates a Stripe Checkout Session, stores a corresponding `paymentEvent` document in the database with status `pending`, and returns the Checkout URL. The `paymentEvent` is what makes the flow auditable. Stripe knows the truth, but the application knows the intent.

2. **Webhook handler.** A public endpoint at `/api/stripe/webhook` that Stripe POSTs to on session events: `checkout.session.completed`, `checkout.session.expired`, payment intent failures. Three rules carry their weight: verify the signature (Stripe's SDK does this — use it), make the handler idempotent (every event ID is processed exactly once, tracked in the database), respond fast (acknowledge in milliseconds, defer real work to a background task).

3. **Reconciliation cron.** A scheduled job that wakes up periodically, finds `paymentEvent` documents stuck in `pending` past a threshold, and asks Stripe directly: *what is the truth about this session?* Updates the local state to match. **This is the part most tutorials skip and the part most production incidents come from.**

4. **Expired session cleanup.** Stripe Checkout Sessions expire 24 hours after creation. After expiration, they cannot be paid. A `paymentEvent` still in `pending` 25 hours later is dead data — it needs to be marked `expired` and the user needs the option to start a new session. Without this, the database fills with zombie pending payments and the UI shows a perpetual "complete your payment" prompt for a session that no longer exists.

**The state machine matters more than the integration.** A `paymentEvent` has four states: `pending`, `completed`, `failed`, `expired`. The transitions look simple on a whiteboard. They are not, because the events that drive them come from three sources: the webhook (synchronous-ish, sometimes late), the cron (delayed but reliable), and the user clicking around the UI (unpredictable, occasionally clicking the same button twice in a panic). Every transition has to be defensible against the other two sources arriving at it from a different direction.

The pre-empted objection from a developer reading this: *"why both webhook and cron — isn't that redundant?"* Yes, deliberately. **Webhooks fail more often than tutorials admit.** Network blips, server deploys, certificate renewals, Stripe service degradations, an over-aggressive rate limiter blocking a legitimate retry. The cron is the safety net. The webhook is the fast path. Together they form a system that converges on truth eventually. Alone, either one has a failure mode that loses money or grants paid features to people who did not pay.

For founders evaluating whether a SaaS is "production-ready," the question to ask the engineer is not *"have you integrated Stripe?"* The question is **"draw me the state machine."** If they can sketch four states and the transitions between them on the back of a napkin, the payment flow is real. If they hesitate or describe only the happy path, what is being delivered is a Stripe demo with a custom skin on top.

The difference between an MVP payment integration and a production payment integration is six edge cases and the discipline to handle each of them. That discipline is what separates a SaaS that takes money from a SaaS that should be allowed to take money.

Next week: GDPR as a product feature. Token-based unsubscribe, anonymization, account deletion, data export, terms acceptance timestamp.

— Christian
