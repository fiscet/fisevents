---
slug: niche-product-over-generic-calendar
title: "Why I built a niche product instead of a generic calendar"
description: "Eventbrite, Calendly, Bookly all assume recurring schedules. That assumption is wrong for the irregular organizers FisEvents was built for — and that gap is the entire product strategy."
publishedAt: 2026-05-18
seriesOrder: 1
---


Eventbrite, Calendly, Bookly, SimplyBook, Acuity. They all assume one thing: that you teach, host, or consult on a **recurring schedule**.

That assumption is wrong for most of the people I built FisEvents for.

A yoga teacher who runs a weekend retreat once every two months. A chef hosting four tasting nights a year. A therapist running a group workshop once per season. A photographer doing one location-based class every spring. None of them have a calendar with fixed slots. They have an irregular pipeline of one-off events that need to be announced, opened for registration, confirmed, reminded about, and checked in on the day — and then they go quiet for weeks or months until the next one.

So most of them never sign up. They run their workflow on Google Forms for registration, a Gmail thread for confirmations, a WhatsApp group for reminders, and a spreadsheet for the attendee list. It works. It's also four tools wired together by hand, every time, and none of them know each other.

This is the user FisEvents was built for. And the product strategy is one sentence long: **do one thing, end to end, in two minutes**.

One thing means: open registration for an event, manage the attendee list, check people in. No calendar booking flow with fixed weekly slots. No recurring service rules. No ticket inventory marketplace. No discount-code engine. No team seats and roles ladder. Nothing that makes sense for someone running thirty events a month and is friction for someone running two.

Pricing follows the same logic — pay-per-publish, no subscription, no card on file at signup. But pricing is the topic of a later post in this series. The interesting part is the product surface.

Every feature in FisEvents is the smallest version of itself that serves the irregular organizer:

- **One-flow event creation.** From "I want to publish an event" to "the registration page is live" in a single form, on one screen, with sensible defaults. No multi-step wizard, no "advanced options" tab.
- **Public organizer page.** Each creator gets a `/pe/[org-slug]` page that aggregates their active events. Discoverable without an account, shareable as one link in a bio. It's not a search engine. It's not a marketplace. It's a single page that says: *here is what this person is running right now*.
- **Email confirmation, reminder, and check-in built in.** Registration and communication collapse into one product. Payment between attendee and creator stays in the creator's existing flow — the platform doesn't insert itself in the money path.
- **Event duplication.** Because the chef who runs "Tasting Night Vol. 1" almost always wants Vol. 2, with the date reset and the attendee list emptied. One click, a new event pre-filled with the previous content. Cooking the same menu twice should not require filling the same form twice.
- **CSV export of attendees.** Because the workflow doesn't end inside the SaaS — it continues in Excel, in the kitchen, in the studio.

Notice what's not on the list. No calendar grid. No recurring rule editor. No "your team" page. No A/B testing of landing pages. No SDK. No public API. Each of those things would expand the addressable market by ~5%, complicate the UI by 100%, and dilute the answer to the only question the user asks: *can I open this event in two minutes?*

That single-purpose discipline is the product. It's also why a small team can build it solo and an incumbent can't strip down to it.

For founders and product leads scoping a SaaS that competes against Eventbrite-class incumbents: the question isn't "can we build a better booking flow." You can't. The question is "is there a user who is **net worse off** the more features the incumbent adds?" If the answer is yes, you have a niche. If the answer is no, you're building feature parity against a company with two hundred engineers.

The math of focus-as-defensibility: Eventbrite **could** ship a stripped-down single-purpose flow tomorrow and crush a product like FisEvents. They won't. Their existing customer base would revolt. Their sales team is incentivized on annual contracts. Their roadmap is owned by someone whose KPI is features shipped. The niche exists not because the incumbents haven't noticed it — it exists because the incumbents are structurally **forbidden** from entering it.

That's the only kind of moat worth building toward.

Next week: how I made a CMS designed for one tenant work for thousands.

— Christian
