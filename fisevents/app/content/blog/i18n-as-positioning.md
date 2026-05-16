---
slug: i18n-as-positioning
title: "i18n as positioning, not cosmetics"
description: "Most apps that advertise 'available in X languages' have shipped a chore, not a strategy. How i18n done from day one let me add a third language in one hour with one JSON file."
publishedAt: 2026-05-28
seriesOrder: 4
---


Most apps that advertise "available in X languages" have shipped a chore, not a strategy.

The difference is architectural. **Translation** is what you do at the end of a project: hire a service, get a spreadsheet back, paste strings into a `messages_es.json` file, hope you did not miss any. **Internationalization** is what you decide at the beginning: every user-visible string is a dictionary lookup, never a literal in the component code, from the very first button.

Most products pick the first route because the second feels like premature optimization. They are wrong. The translation route has a cost curve that starts at zero and ends at "rewrite the front end." The internationalization route has a cost curve that starts at a small architectural decision and ends at "one JSON file per new market."

FisEvents took the second route. From the second month of the project, every visible string passed through a `DictionaryProvider`. There are no hardcoded labels in any component. None. The rule is binary: if a user sees it, it is a dictionary key.

The payoff is operational. Adding any new language to FisEvents takes roughly an hour: one new file in the dictionaries folder, one config entry, one deployment. There is no scavenger hunt for hardcoded labels, no missing strings discovered in production, no awkward fallback to English in unexpected corners of the UI. A new language shows up complete because the architecture makes anything else impossible.

This is the positioning move, not the cosmetic one. **Adding a language for a SaaS that targets niche professionals — yoga teachers, course organizers, event hosts — is the cheapest market-expansion lever the product has.** The addressable market for irregular event organizers in any single European country is a few hundred thousand people. Across three or four adjacent markets, it is several times that. The engineering cost to expand from one country to three is the cost of three JSON files, not three product launches.

For founders scoping a niche product, this is the question worth asking the engineer on week one: *will this product be hard or easy to localize later?* The answer determines whether expansion into adjacent markets is a marketing decision or an engineering project. Marketing decisions happen in days. Engineering projects happen in quarters.

The discipline behind the architecture is what costs. Every "Save" button has to be `t('common.save')`. Every error message. Every empty state. Every confirmation modal. Every email subject that ends up in a transactional email. The first time a developer writes `<Button>Save</Button>` instead of `<Button>{t('common.save')}</Button>`, the moat starts leaking. The discipline itself is the moat — and most teams break it within the first month, then spend years pretending they did not.

There is a related decision that follows from i18n done correctly: **content versus interface**. Interface strings — buttons, errors, navigation — belong in the dictionary, owned by the developer, version-controlled, deployed with the application. Content strings — event descriptions, user-submitted text, creator bios — belong in the CMS, edited by the user, not subject to localization. Mixing the two is the second-most-common i18n mistake. FisEvents uses Sanity for content and JSON dictionaries for interface, and the boundary is bright: the developer never touches user content, the user never touches developer strings.

The decision-maker takeaway is not about translation services or dictionary providers. It is about the **leverage ratio**. A well-architected i18n decision is one of the highest-leverage choices a product team makes early, and one of the most expensive things to retrofit late. The cost ratio between "i18n from day one" and "i18n from year three" is roughly 1:100. There are very few product decisions with that kind of asymmetry.

If the engineer on the team says "we can add that later," ask how. If the answer is anything other than "every string is already a dictionary lookup," you are not getting i18n later — you are getting an excuse later.

Next week: pay-per-publish versus subscription. The pricing thesis that disqualifies 80% of competitors for my user.

— Christian
