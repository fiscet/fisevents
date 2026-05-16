---
slug: series-intro
title: "Most 'I built a SaaS' portfolios end at the MVP. Mine starts there."
description: "A ten-part series on the decisions, trade-offs, and slow grind of building FisEvents over 22 months — what a CEO cares about, not what a junior dev wants to copy."
publishedAt: 2026-05-15
seriesOrder: 0
---


Every developer LinkedIn portfolio looks the same: a login screen, a CRUD, a Stripe button, a Vercel link. Then silence. Nothing about GDPR. Nothing about the cron that reconciles abandoned payments. Nothing about the auth flow that was simplified down to zero friction. Nothing about the seven months the project sat untouched.

Over 22 months — not continuous, with long pauses that are part of every real solo product — I built and shipped **FisEvents**: a multi-tenant SaaS for event registration (yoga classes, workshops, one-off courses). 209 commits. Roughly seven net months of actual work. The rest is what solo development actually looks like: months of silence, a refactor nobody applauds, and the slow grind of doing the boring parts. GDPR. SEO. Webhook reconciliation. PWA conversion. Security headers.

Over the next ten weeks I'll publish ten articles. Not a commit log. Not a tutorial. Each post is one problem I had to solve and the decision I made — the kind of decision a CEO or founder cares about, not the kind a junior dev wants to copy-paste.

Here's what's coming:

1. **Why I built a niche product instead of a generic calendar** — and why "subscription" is a tax on irregular usage.
2. **Multi-tenancy when your CMS won't do it natively.** Sanity is great. It's also single-tenant by design.
3. **Securing a multi-tenant SaaS with ArcJet.** Rate limiting, bot protection, and hardened webhooks — applied, not theorized.
4. **i18n as positioning, not cosmetics.** How I added a third language in one hour with one JSON file.
5. **Pay-per-publish vs subscription.** The pricing thesis that disqualifies 80% of competitors for my user.
6. **Anatomy of a production Stripe flow.** Checkout, webhook, reconciliation cron, expired sessions. The parts no tutorial covers.
7. **GDPR as a product feature.** Token-based unsubscribe, anonymization, account deletion, data export, ToS timestamp.
8. **The SEO mistakes most developers make** — including the one where staging environments leak into Google.
9. **From magic link to zero friction auth.** Why I removed every social login and what it simplified.
10. **PWA instead of a native app.** Why I'd skip the app store again.

I'll close the series with a bonus piece on what I'd do differently — including the seven-month silence, the Storybook I removed after eighteen months, and the carousel that took three commits to build and one to delete.

Most "building in public" content is written for other developers. This series isn't. The framing throughout is the one that actually matters: what problem, what decision, what trade-off, and what it cost.

A few numbers to set the bar:
- 22 months of calendar time (non-continuous, with long pauses), ~7 months of actual development
- 209 commits across one solo dev, AI-assisted only in the final month
- Stack: Next.js 15, React 19, TypeScript, Sanity CMS, NextAuth, Stripe, Tailwind, Serwist, ArcJet, Jest
- Multi-tenant, internationalized in three languages, GDPR-compliant, PWA, indexed
- Pricing model: first event free, pay-per-publish after that, no subscription

Follow along — or don't.

Next week: why generic calendars and subscription-based booking tools are the wrong product for the people I built FisEvents for.

— Christian
