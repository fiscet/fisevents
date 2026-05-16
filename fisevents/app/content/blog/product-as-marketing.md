---
slug: product-as-marketing
title: "Product-as-marketing"
description: "Most marketing strategy sessions are attempts to invent claims the product cannot deliver. FisEvents was built so the product itself makes the marketing claims — structurally, in code."
publishedAt: 2026-06-22
seriesOrder: 11
---


Most *"marketing strategy"* sessions are attempts to invent claims the product cannot actually deliver. A pricing page promises something; the database does something else. A landing page says *"GDPR compliant"*; the unsubscribe link requires login. A meta description says *"for solo creators"*; the signup flow demands a credit card upfront. The expensive part of marketing — the part that compounds — is not the campaign. It is the gap, or the absence of gap, between what the product is and what the marketing claims.

FisEvents shipped without a marketing campaign. Not by accident — the campaign will come, in a measured way, over the next quarter. But the product itself was built so that when the campaign arrives, the marketing budget is a multiplier on a product that already makes its claims structurally. That decision was made in code, before any pricing page was written.

**Every previous article in this series describes a marketing decision in disguise:**

- **Pricing as positioning.** First event free, €4.70 after. No subscription. That sentence is a competitive claim that no campaign needs to communicate — the pricing page makes it on its own, and a decision-maker reading two pricing pages reaches the comparison in five seconds. The marketing work is done in the database, where the pricing logic lives.

- **The public organizer page.** Every creator gets a shareable URL aggregating their events. Every time a creator shares it in their Instagram bio or sends it to attendees, the platform earns one inbound touch — at zero marketing cost. The product structure converts every creator into a distribution channel.

- **GDPR as feature.** The marketing pitch *"we respect your data"* is empty for most products. It is verifiable for FisEvents. Anyone can click the unsubscribe link, the delete account button, the export button, and see the claim being kept. **Claims you can verify are marketing. Claims you cannot are advertising.**

- **i18n at the architecture layer.** Entering a new European market does not require a localization vendor contract or a six-month translation project. It requires one JSON file and one config entry. The marketing decision *"we serve Italy and adjacent markets"* costs hours, not quarters.

- **Landing pages per use case.** SEO is split by niche before any campaign starts. *"Booking platform for yoga workshops"* and *"signup for cooking classes"* rank for different keywords because the product ships different pages for them. Acquisition routing happens in the codebase, not in a media plan.

- **Free first event.** The trial is not a 14-day countdown. It is a real published event, used in production, with real attendees. The conversion moment is the user proving to themselves that the product works, not the user pressing a button before a deadline.

None of these decisions cost a marketing budget. All of them cost product discipline at the moment the architecture was set.

**The pre-empted objection** from a CMO reading this: *"yes, but you still need acquisition."* Correct. Product-as-marketing is the multiplicand, not the multiplier. Paid ads, partnerships, content, outbound — these are real channels and they matter. But they amplify whatever the product makes structurally available. **A 10x acquisition campaign on a 0x product yields zero.** A modest acquisition effort on a product that makes its claims by construction compounds.

This is why the right sequencing for a small SaaS is to spend the first year putting the marketing into the product, and the second year putting acquisition behind it. Doing it in the opposite order is one of the most expensive mistakes a small SaaS makes: ad budget spent on a product that cannot keep the promises the ads make, followed by churn that gets blamed on positioning when the real failure was architectural.

For founders evaluating a roadmap, the question is not *"what is our marketing budget?"* before the product ships. The question is **"which of our marketing claims is the product structurally able to deliver — and which require a slide deck to explain?"** If the answer is mostly slide decks, the product is not ready for a campaign. Build the claim into the code first. Then let the budget amplify a product that already says, by what it is, exactly what the marketing was going to spend money to say.

Marketing budgets compound. Product decisions decide whether they compound upward or downward.

Next week — the closing piece of the series: what I would do differently. The seven-month silence, the Storybook removed after eighteen months, the carousel that took three commits to build and one to delete.

— Christian
