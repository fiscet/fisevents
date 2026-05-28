---
slug: securing-multi-tenant-saas-with-arcjet
title: "Securing a multi-tenant SaaS with ArcJet"
description: "A SaaS becomes a real product the first time a stranger can break it. Rate limiting, bot protection, and hardened webhooks — applied, not theorized."
publishedAt: 2026-05-25
seriesOrder: 3
image: /img/blog/securing-multi-tenant-saas-with-arcjet.png
---


A SaaS becomes a real product the first time a stranger can break it.

For the first many months of its life, FisEvents was not a SaaS. It was a personal tool, built for one specific user I knew by name. The existing booking products were either too thin for the use case or wanted a monthly subscription that did not fit it. So I started building. There was no business plan. There was no "launch." There was no public registration. The threat model was implicit: I trusted the one person who would use it.

Then the original need ended, and I kept going — because the project was interesting on its own, because I wanted to know how far I could take it, because I had already invested months into it. At some point Vercel makes deploying so frictionless that I deployed it. Not on a real domain — just on the default `vercel.app` URL that Vercel assigns to every project. That kind of URL feels private by default. It is not. It is a fully public URL the moment it exists: anyone who knows it can reach it, search crawlers can find it, scanners probe it the same as any other host on the internet. The product was on the open internet from the first deploy. I did not treat it that way.

There is no commit in the repo that says *project is now public, time to harden it.* There is just a slow shift in what the threat surface looked like — a shift I noticed late, because the URL never changed and I kept thinking of the project as the private thing it had been.

By the time I added ArcJet, in month 22, the public registration form had been live for months. The magic-link send route had been open to the internet for longer than that. Nothing bad had happened. But the absence of an incident is not the same as the presence of protection.

This is the part developers get wrong about side projects that become products. They keep treating a deployed, indexed, public product like the personal tool it started as. The URL is out. The form is open. The webhook is reachable. The fact that nobody has abused it yet is not architecture — it is luck.

What I had right from day one was the **baseline**: server-side validation on every mutation, ownership checks at the action layer, signed Stripe webhooks. Those came automatically because I had built application backends before. They were enough to keep the product from being trivially broken.

What I did not have was the **topcoat**: protection against the kinds of traffic that only matter once the product is on the open internet. Bots that scrape public forms and submit to them automatically. Rate limits on the magic-link endpoint so it cannot be turned into an email-bombing primitive against someone else. Detection of disposable email domains so the signup list is not half garbage. Shield rules against the constant low-grade probing that any indexed domain receives, regardless of how small the audience.

That is what ArcJet adds — a layer of rules that lives next to the route handlers, written in TypeScript, deployed with the application. No separate dashboard. No separate team. No separate context-switch every time a route changes. Rules in the codebase, where the rest of the product lives. The right tool for a team without a dedicated security function.

The decision-maker lesson is not about ArcJet specifically. It is about **the transition**. Every solo project that gets deployed crosses a line from "thing I am working on" to "product that exists on the internet." The line is invisible. It happens between commits. Nobody marks it. Most builders never think about it explicitly because they assume "launching" is a single event with a date attached. In side projects that grow into products, launching is a process that happens silently over months.

For founders evaluating a build-in-public side project as the basis for a real company: the security posture from before that line is not the security posture you need after it. Ask the developer what they added the day the project became public. If the answer is "nothing, it was always this way," what is being bought is a product still living in the trust model of its early days. That is not a product. That is exposure with a logo.

Next week: how I added a third language in one hour with one JSON file. i18n as positioning, not cosmetics.

— Christian
