import { sanityClient } from '@/lib/sanity.cli';
import { sendMail } from '@/lib/send-mail';
import { getEmailDictionary } from '@/lib/i18n.utils';
import { applyTemplate } from '@/lib/email-template';
import { getPublicEventSlug, getPublicEventUrl } from '@/lib/utils';
import { formatEventDateTime } from '@/lib/date-utils';
import { createUnsubscribeToken } from '@/lib/unsubscribe-token';
import { eventEmailContextQuery } from '@/lib/queries';
import { WAITLIST_OFFER_WINDOW_HOURS } from '@/lib/registrations';
import type { Registration } from '@/types/sanity.types';
import type { Locale } from '@/lib/i18n';

const DEFAULT_LANG: Locale = 'it';

/**
 * Emails a waitlisted attendant who was just offered a freed spot, with a
 * link to accept it before `offerExpiresAt`. Called from both the
 * cancellation path (lib/actions.ts) and the expiry cron
 * (app/api/cron/waitlist-expiry), which is why it lives in a plain lib module
 * rather than the 'use server' actions file.
 */
export async function notifyWaitlistPromotion({
  eventId,
  promoted,
  lang = DEFAULT_LANG,
}: {
  eventId: string;
  promoted: Registration;
  lang?: Locale;
}) {
  if (!promoted.email || !promoted.uuid) return;

  const event = await sanityClient.fetch<{
    title: string;
    location?: string;
    talkTo?: string;
    timeZone?: string;
    startDate?: string;
    endDate?: string;
    publicSlug: string;
    companyName: string;
    organizationSlug: string;
  } | null>(eventEmailContextQuery, { eventId }, { cache: 'no-store' });

  if (!event) return;

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const publicSlug = getPublicEventSlug(event.publicSlug, event.organizationSlug);
  const token = createUnsubscribeToken({ eventId, uuid: promoted.uuid, email: promoted.email });
  const acceptLink = `${baseUrl}/${lang}/pe/waitlist-accept?eventSlug=${publicSlug}&t=${token}`;

  const emailDict = await getEmailDictionary(lang);
  const offerDict = emailDict.event_attendant.waitlist_offer;

  const vars = {
    attendant_name: promoted.fullName ?? '',
    event_title: event.title,
    accept_link: acceptLink,
    location: event.location ?? '--',
    talk_to: event.talkTo ?? '--',
    start_date: event.startDate
      ? formatEventDateTime(event.startDate, lang, event.timeZone, { dateStyle: 'medium', timeStyle: 'short', hour12: false })
      : '--',
    end_date: event.endDate
      ? formatEventDateTime(event.endDate, lang, event.timeZone, { dateStyle: 'medium', timeStyle: 'short', hour12: false })
      : '--',
    company_name: event.companyName,
    offer_hours: String(WAITLIST_OFFER_WINDOW_HOURS),
  };

  await sendMail({
    sendTo: promoted.email,
    subject: applyTemplate(offerDict.subject, vars),
    text: applyTemplate(offerDict.body_txt, vars),
    html: applyTemplate(offerDict.body_html, vars),
  });
}
