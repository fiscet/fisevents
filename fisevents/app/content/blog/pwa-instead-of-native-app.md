---
slug: pwa-instead-of-native-app
title: "PWA instead of a native app"
description: "'We need a native app' is one of the most expensive sentences spoken in a SaaS meeting. Why I would skip the app store again — and what a PWA actually buys you."
publishedAt: 2026-06-18
seriesOrder: 10
---


*"We need a native app"* is one of the most expensive sentences spoken in a SaaS product meeting. Most of the time, it is a marketing instinct disguised as a product requirement.

What is being asked for, when someone says they need a native app, is almost never the technical capabilities of a native app. It is the user behaviors associated with one: a home screen icon, instant launch, offline capability, mobile-first ergonomics, the sense that the product is *"real."* None of those require shipping through Apple's or Google's app stores.

FisEvents shipped as a Progressive Web App via Serwist in May 2026 — service worker, manifest, installability from mobile. The user opens the URL on their phone, sees a prompt to add to home screen, taps it, and the product is now an icon next to Instagram and WhatsApp. Indistinguishable from a native app to anyone who is not a developer looking at the address bar.

**What a native app gives you that a PWA does not:**

- Deep OS integration (HealthKit, ARKit, advanced Bluetooth, background services beyond service workers)
- App store discovery — people browsing categories on the App Store or Play Store
- A specific badge of "appness" on iOS lock screens and certain notifications

For an event registration platform whose users are yoga teachers, chefs, workshop hosts, none of that matters. The creator needs to publish an event from their phone in two minutes. The attendee needs to register from their phone in thirty seconds. A web app launched from a home screen icon does both. The OS integrations FisEvents would actually use are the ones PWAs already support: push notifications, share sheet, basic offline cache.

**What native costs you, by contrast:**

- **App store commission.** 15–30% of every in-app transaction, on platforms that increasingly require in-app purchase for digital services. For a product like FisEvents charging €4.70 per published event, that commission is the difference between a viable business and an interesting hobby.
- **Two codebases, or one indebted one.** Either separate iOS and Android development, or a cross-platform framework that brings its own debugging tax. Either way, more surface area for a small team than the entire web product currently has.
- **Submission review.** Every release goes through human review. The shortest path from *"bug discovered"* to *"fix in production"* is hours on the web. On the app stores, it is days, and sometimes the days do not end.
- **Compliance with the gatekeeper's roadmap.** When Apple changes its rules on tracking, in-app subscriptions, or any other policy, every native app reacts on a deadline that is not the team's deadline.
- **Risk of removal.** App store accounts get suspended — sometimes by mistake, sometimes by interpretation of policy. A PWA can be deindexed from a search engine. A PWA cannot be deleted from a user's phone by the platform vendor.

The trade-off becomes mathematical: PWA preserves the home-screen-icon UX that 95% of users actually want, removes 100% of the cost that comes with the app store. There is no version of this calculation where shipping native makes sense for a small SaaS that is not selling something that requires deep platform features.

The pre-empted objection from a non-technical stakeholder: *"but customers expect a native app."* Almost never. They expect the product to work on their phone. PWA delivers that. The expectation of an app store presence usually comes from one of two places: a marketing instinct that *"real"* products are in the store, or a competitor analysis where the incumbents are. Neither is a product requirement. Both are stories that can be reframed.

For founders evaluating a roadmap, the question is not *"should we build a native app?"* The question is **"which platform features do our users actually need, and which are unavailable via PWA?"** If the answer to the second part is short — and for most SaaS, it is — then native is a distribution decision, not a technology decision. Distribution decisions can be made later, when there is enough revenue to absorb a 30% commission. Technology decisions made early are expensive to reverse.

PWA shipped at the end of the FisEvents build because it is naturally the last layer: it sits on top of a working web app and turns it into an installable one. It is also, deliberately, the only "mobile app" the product needs.

The next time someone asks whether FisEvents has an iOS app, the answer is: it has the icon on the home screen, the speed of a native app, and the deployment cycle of a website. **The app store is a distribution channel disguised as a technology requirement. Distribution channels can be added later. Technology choices made early are expensive to reverse.**

Next week — the closing piece of the series: what I would do differently. The seven-month silence, the Storybook removed after eighteen months, the carousel that took three commits to build and one to delete.

— Christian
