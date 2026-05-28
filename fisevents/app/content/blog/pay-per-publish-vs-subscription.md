---
slug: pay-per-publish-vs-subscription
title: "Pay-per-publish vs subscription"
description: "SaaS pricing wisdom says 'always subscription.' It is right 80% of the time. The other 20% is where FisEvents lives — and the pricing model disqualifies most competitors for my user."
publishedAt: 2026-06-01
seriesOrder: 5
image: /img/blog/pay-per-publish-vs-subscription.png
---


The conventional wisdom in SaaS pricing is one sentence long: *always subscription, always recurring*. It is the right advice 80% of the time. It is the wrong advice for the other 20%, and most founders never check which group they are in before they price.

FisEvents prices on the 20% side. First event of every month is free. Every additional event is €4.70 via Stripe Checkout. No subscription. No card on file at signup. No trial that auto-converts. If a creator runs no events in a month, they pay nothing that month. If they run six in one weekend, they pay €23.50 once and they are done.

This is unusual enough in the booking category to read as reckless or naive. It is neither. It is a deliberate disqualification of every competitor whose pricing model assumes a usage pattern their user does not have.

**The user math is the entire argument.** A yoga teacher running four workshops a year on a mid-tier booking platform plan pays roughly €25–€30 per month — €300–€360 annually, to host four transactions. That is €75–€90 in platform fees per event, on events that typically retail for €25–€60 per attendee. The platform's cut of the creator's revenue lands somewhere between 10% and 30% before any transaction fee. **Subscription pricing is a tax on irregular usage.** Anyone who publishes sporadically is subsidizing the heavy users on the same plan.

The pay-per-publish counter-model rewrites the math. €0 in idle months. €0 in single-event months, because the first event is free. €4.70 per additional event after that. The same yoga teacher with four workshops a year pays €0 if they spread them across four months, or €14.10 if they bundle three into one. Either way: roughly 95% less than the subscription alternative.

This is the kind of pricing delta that does not need a marketing campaign to communicate. A decision-maker reading two pricing pages takes thirty seconds to do the math and five seconds to choose.

**What pay-per-publish disqualifies, structurally:**

- Every competitor whose unit economics depend on capturing idle months. Their ARPU collapses if they cannot tax the months a user does not use the product.
- Every competitor with an enterprise sales motion. There is nothing for a sales engineer to negotiate at €4.70 per event. The price is the price.
- Every competitor whose internal KPI is MRR. Pay-per-publish does not produce monthly recurring revenue. It produces per-event revenue, which graphs differently and aligns with the user's actual behavior instead of the calendar.

The product implications cascade outward from the pricing model:

- **No card on file at signup.** Signup is genuinely free. The first paid event triggers Stripe Checkout, where the card is captured at the moment of purchase intent, not as a hostage.
- **No churn metric.** A user who runs no events for six months has not churned. They are dormant, and they cost the platform nothing. The next event they run is revenue, not a winback campaign.
- **No price-page anxiety.** One number, one transaction model, no tiers. The substance of the entire pricing page fits in a sentence. Confused users do not convert; clear pricing produces a binary decision in seconds.

The pre-empted objection from any investor is *"but you have no predictable revenue."* Correct — there is no MRR line to project against. The counter is that **MRR is an investor's preference, not a customer's preference.** Customers prefer to pay for what they use. Investors prefer to model what they own. When a product is built for a niche the investors are not personally in, the customer's preference wins.

For founders evaluating pricing models on a new SaaS, the question that matters is not *"what does the category charge?"* The question is **"what is the usage frequency distribution of the people I want as customers?"** If the distribution is bimodal — a few heavy users and many irregular ones — subscription pricing forces the irregular users to fund the heavy ones, and the irregular ones leave. Per-transaction pricing inverts the math: heavy users still pay heavily because they publish more, and irregular users pay only for what they consume.

Conventional SaaS pricing is a vendor-side optimization disguised as a customer-side feature. Pay-per-publish is the customer-side version of the same trade. One of those moves attracts irregular users. The other repels them and pretends not to know why.

Next week: anatomy of a production Stripe flow. Checkout, webhook, reconciliation cron, expired sessions — the parts no tutorial covers.

— Christian
