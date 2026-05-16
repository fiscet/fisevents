---
slug: multi-tenancy-with-sanity
title: "Multi-tenancy when your CMS won't do it natively"
description: "Sanity is the best content modeling tool I have used. It is also single-tenant by design. How I built multi-tenant isolation on top of it — and what that costs."
publishedAt: 2026-05-21
seriesOrder: 2
---


Sanity is the best content modeling tool I have used. Real-time collaboration on schemas. GROQ as a query language that beats GraphQL for read patterns. Draft and publish workflow built in. Image pipeline with on-the-fly transforms and a global CDN. Schemas declared as TypeScript that generate their own types. For a developer who cares about content as data, Sanity is a quiet revolution.

It is also, by every meaningful definition, a **single-tenant product**.

A Sanity project is one workspace. One dataset. One Studio. One set of roles. You can scope read access at the document level, but you cannot hand the Studio UI to a thousand independent creators and say "see only your stuff." The whole product is designed around a known, small editorial team — a marketing department, a magazine, a documentation crew. It is not designed around the user pattern of a SaaS: anonymous signups, tenant isolation, self-service content creation by people who will never know what GROQ stands for.

This was the architectural problem at the center of FisEvents. The data model wanted Sanity. The product surface didn't.

The first instinct of every developer who has worked with a CMS before is: *give the creators access to the Studio with restricted permissions*. It is the wrong instinct, and it fails on three fronts.

- **UX.** Sanity Studio is a tool for editors who want to be in the tool. A yoga teacher publishing a workshop will open it once, never understand the document/draft model, and close the tab. The bounce rate of "non-content-people in front of a CMS UI" is essentially 100%.
- **Security boundary.** Studio permissions are role-based, not tenant-based. To give creator A access only to creator A's events, you build a permissions layer on top of the role system. You are now writing the multi-tenant logic Sanity didn't write, except inside a tool you don't own and can't fully test.
- **Branding and onboarding.** Sanity Studio is Sanity's UI, not yours. You can theme it, but you cannot make it disappear. The first thing a new SaaS user should see is your product, not your CMS vendor.

The decision I made — and would make again — is **layer separation**:

- **Sanity stays as the data layer.** Schemas, GROQ, image pipeline, draft/publish, content lake. The parts of a CMS that are genuinely hard to build well.
- **Sanity Studio becomes my admin panel.** Super-admin operations only. Reviewing creators, monitoring revenue, inspecting payment events. One user — me. The tool is finally being used for what it is good at.
- **Creator-facing CRUD is rebuilt in Next.js.** React Hook Form and Zod for the event form. Server actions that hit Sanity with a server-side token. Every read filtered by `organization._id`, every mutation gated by ownership checks at the action layer. The creator never sees a Studio. They see my product, on my domain, with my brand.

The trade-off is real: I write more code than I would if Sanity Studio could host the creator UX. The event form alone is hundreds of lines of TypeScript I would not have written if I had stayed inside the Studio. But the code is in the right place. It lives in my repo, in my product, under my brand, with my tests, deployed on my schedule. The CMS does what a CMS does. The application does what an application does. They are not pretending to be each other.

For founders evaluating CMS-backed SaaS architectures, the pre-emptive objection is always "why not skip Sanity, use Postgres directly, do row-level security for tenant isolation?" The answer is the value Sanity provides above the database. Content modeling that the team can iterate on without a migration. A publish/draft model that takes weeks to write from scratch. A hosted image pipeline that replaces a Cloudinary bill. An authoring tool I get for free for my own admin work. Skipping Sanity to get tenant isolation cheaply trades a feature I do not need at the CMS layer (multi-tenant authoring) for a stack of features I would otherwise have to build from zero (modeling, publishing, image, admin UI).

The lesson sits one level below the usual "buy or build" question. The wrong question is "do we buy a CMS or build one ourselves?" The right question is **"which layer do we buy, and which layer do we build?"** With FisEvents I bought the data and admin layer (Sanity) and built the user-facing layer (Next.js). Two layers, one product. The architectural mistake that kills small SaaS is treating this as a single decision for the whole stack — and ending up either trapped inside a vendor's UI, or reinventing infrastructure that has been a commodity for years.

Sanity did not owe me multi-tenancy. I owed myself the discipline to stop expecting it from a tool that was never going to provide it.

Next week: the moment a SaaS becomes a real product is the moment a stranger can break it. Securing FisEvents with ArcJet — applied, not theorized.

— Christian
