---
slug: magic-link-zero-friction-auth
title: "From magic link to zero friction auth"
description: "Social login buttons do not reduce friction — they displace it. Why I removed every social login from FisEvents and what it simplified."
publishedAt: 2026-06-15
seriesOrder: 9
image: /img/blog/magic-link-zero-friction-auth.png
---


Every signup flow with a "Sign in with Google" button has the same shape. There is a primary path (email and password, or email and magic link), and there is a row of social provider buttons next to it. The conventional wisdom is that the social buttons reduce friction.

They do not. They **displace** friction.

Social login takes the friction of creating an account at your product and moves it into the OAuth screens of a third party — where the user must remember which Google account they used last time, dismiss a permission consent screen, possibly re-authenticate, and only then arrive back at the application. The friction is not gone. It is happening somewhere you cannot see, with a vendor that is not you, and a non-trivial percentage of users abandon the flow inside that vendor's UI without your application ever finding out why.

FisEvents shipped with both magic link and Google social login. The decision to remove Google login was not principled at first — it was triggered by a billing event.

Enabling Google as an OAuth provider requires creating a Google Cloud project, and creating a Google Cloud project requires a billing account with a credit card on file. That is the prerequisite, even if the OAuth service itself sits within the "free" tier. In my case, that billing account was then charged a meaningful amount for a service I had not knowingly used. The only path I found to stop further charges was to close the account entirely — which invalidated the OAuth credentials and broke the Google login flow in production.

The lesson is not specifically about Google. It is about the structure: **enabling social login required handing payment details to a vendor I had no commercial leverage with, for a feature that was supposed to be free.** A product that requires a third party to function is a product that third party can break. A product that requires a third party *and* a billing relationship with them is also one they can bill — on their schedule, for reasons that may not match what you thought you signed up for.

Once Google login was gone, the cleanup revealed how much complexity it had been adding for negative returns.

**What removing the social login simplified:**

- **One auth code path.** Two paths means twice the error states to handle, twice the documentation, twice the surface for bugs. Two paths also means every UI screen that handles authentication has a branch: *if this user signed up via Google, do X; otherwise, do Y.* Each of those branches is a future bug.

- **Fewer vendor relationships.** Google login required maintaining a Google Cloud project, OAuth credentials, consent screen configuration, scope justifications, regular policy reviews. Apple login would have added the same complexity in a different shape. Each social provider is a separate vendor that has to be kept healthy on a schedule that is not yours.

- **No "wait, which account did I use?" support tickets.** Users who sign up through Google routinely forget which of their three Google accounts they used. They try the wrong one, land in a new empty account, then contact support thinking the platform lost their data. This category of issue is impossible by design with magic link — the email address is the account.

- **No silent abandonment.** The OAuth flow is a black box from the application's perspective. If a user clicks "Sign in with Google" and never comes back, the application has no way to know whether they declined consent, hit a network error, or changed their mind. Magic link gives a usable signal: the email was sent, the link was clicked or it was not.

**What magic link is, in product terms.** The user types their email. The application sends a signed link. The user clicks the link. The session is authenticated. The token is short-lived (minutes, not hours), the signature is verified server-side, and the user never types a password. The third party in this equation is the user's own email provider — which is already the third party they trust enough to receive every password reset, every receipt, every account notification, every important conversation they have ever had online.

The trade-off is real and worth naming: magic link depends on transactional email delivery being reliable and fast. If the email arrives in five minutes instead of five seconds, the user is gone. The fix is engineering hygiene around the email pipeline — warmed sending domain, SPF and DKIM and DMARC properly configured, a reputable transactional provider, real monitoring on delivery times. **The auth choice is a question about which third party is the failure mode you can manage.** Magic link puts that third party on the email side, which the application already has to manage for receipts, notifications, and unsubscribe links anyway. Social login puts it on a vendor relationship where the application has no leverage.

For founders evaluating auth setups, the right question is not *"do we offer Google login?"* The right question is **"how many vendors must be operational for a new user to sign up successfully?"** Every additional vendor is an additional point of failure, an additional rate limit, an additional terms-of-service document, an additional surface for the user to drop off without anyone noticing.

Removing Google login removed a feature. It also removed a category of bug, a vendor relationship, a support load, and a non-trivial signup abandonment rate. That is what "zero friction" actually means: not the absence of effort, but **the absence of paths that can fail in ways you cannot debug.**

Next week: why I shipped a PWA instead of a native app, and would skip the app store again.

— Christian
