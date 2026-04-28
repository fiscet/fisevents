'use server';

import { sanityClient } from './sanity.cli';
import {
  eventListQuery,
  eventMonthlyCountQuery,
  eventSingleByIdQuery,
  eventSingleBySlugQuery,
  eventStatusBySlugQuery,
  eventSingleHasAttendantByEmailQuery,
  eventSingleHasAttendantByUuidQuery,
  eventIdQuery,
  publicEventListByOrgSlugQuery,
  userQuery,
  userQueryBySlug,
} from './queries';
import { stripe, PUBLISH_PRICE_CENTS } from './stripe';
import {
  CurrentUser,
  OccurrenceList,
  OccurrenceSingle,
  OrgPublicEvent,
  PublicOccurrenceSingle,
} from '@/types/sanity.extended.types';
import { EventAttendant, Occurrence, User } from '@/types/sanity.types';
import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { toUserIsoString } from './utils';
import { getSession } from '@/lib/auth';
import { eventAttendantSchema } from './form-schemas';
import arcjet, { validateEmail } from '@/lib/arcjet';
import { request } from '@arcjet/next';
import { sendMail } from '@/lib/send-mail';
import { getEmailDictionary } from '@/lib/i18n.utils';
import { getPublicEventSlug, getPublicEventUrl } from '@/lib/utils';
import { applyTemplate } from '@/lib/email-template';
import type { Locale } from '@/lib/i18n';
import { createUnsubscribeToken } from '@/lib/unsubscribe-token';
import { createDeleteAccountToken } from '@/lib/delete-account-token';

const aj = arcjet.withRule(
  validateEmail({
    mode: 'LIVE',
    deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
  })
);

const validateSession = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error('Session not found');
  }
  return session;
};

const revalidateTags = (tags: string[]) => {
  tags.forEach(tag => revalidateTag(tag));
};

/** USERS */
export const getUserById = async ({ userId }: { userId: string; }) => {
  return await sanityClient.fetch<CurrentUser>(
    userQuery,
    { userId },
    { next: { tags: ['user'] } }
  );
};

export const getUserBySlug = async ({ slug }: { slug: string; }) => {
  return await sanityClient.fetch<CurrentUser>(
    userQueryBySlug,
    { slug },
    { next: { tags: ['user'] } }
  );
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}) => {
  await validateSession();
  const res = await sanityClient.patch(id).set(data).commit();
  revalidateTags(['user']);
  return res;
};

/** EVENTS */
export const getEventIdList = async ({
  active = true,
}: {
  active?: boolean;
}) => {
  return await sanityClient.fetch<{ _id: string; }[]>(
    eventIdQuery,
    { active },
    { next: { tags: ['eventSlugList'] } }
  );
};

export const getEventList = async ({ createdBy }: { createdBy: string; }) => {
  return await sanityClient.fetch<OccurrenceList[]>(
    eventListQuery,
    { createdBy },
    { next: { tags: ['eventList'] } }
  );
};

export const getEventSingleById = async ({
  createdBy,
  id,
}: {
  createdBy: string;
  id: string;
}) => {
  return await sanityClient.fetch<OccurrenceSingle>(
    eventSingleByIdQuery,
    { createdBy, id },
    { next: { tags: [`eventSingle:${id}`] } }
  );
};

export const getEventSingleBySlug = async ({ slug }: { slug: string; }) => {
  return await sanityClient.fetch<PublicOccurrenceSingle>(
    eventSingleBySlugQuery,
    { publicSlug: slug },
    { next: { tags: [`eventSingleBySlug:${slug}`] } }
  );
};

export const getEventStatusBySlug = async ({ slug }: { slug: string; }) => {
  return await sanityClient.fetch<{ title: string; active: boolean; pendingPayment: boolean; } | null>(
    eventStatusBySlugQuery,
    { publicSlug: slug },
    { cache: 'no-store' }
  );
};

export const deleteEvent = async ({ id }: { id: string; }) => {
  const session = await validateSession();
  const userId = session.user!.uid as string;

  const occ = await sanityClient.fetch<{
    _id: string;
    pendingPayment?: boolean;
    attendants?: unknown[];
    endDate?: string;
    createdByUser?: { _ref: string; };
  } | null>(
    `*[_type == "occurrence" && _id == $id][0] { _id, pendingPayment, attendants, endDate, createdByUser }`,
    { id }
  );

  if (!occ || occ.createdByUser?._ref !== userId) {
    throw new Error('Not found or unauthorized');
  }
  if (!occ.pendingPayment) {
    throw new Error('Only unpaid events can be deleted');
  }
  if ((occ.attendants?.length ?? 0) > 0) {
    throw new Error('Cannot delete event with attendants');
  }
  if (occ.endDate && new Date(occ.endDate) < new Date()) {
    throw new Error('Cannot delete an expired event');
  }

  await sanityClient.delete(id);
  revalidateTags(['eventList']);
};

export const getPublicEventListByOrgSlug = async ({ orgSlug }: { orgSlug: string; }) => {
  return await sanityClient.fetch<OrgPublicEvent[]>(
    publicEventListByOrgSlugQuery,
    { orgSlug },
    { next: { tags: [`orgEvents:${orgSlug}`] } }
  );
};

export const resumeOrCreateCheckout = async ({
  occurrenceId,
  lang = 'it',
}: {
  occurrenceId: string;
  lang?: string;
}) => {
  const session = await validateSession();
  const userId = session.user!.uid as string;

  const occ = await sanityClient.fetch<{
    _id: string;
    title?: string;
    stripeSessionId?: string;
    pendingPayment?: boolean;
    createdByUser?: { _ref: string; };
  } | null>(
    `*[_type == "occurrence" && _id == $id][0] { _id, title, stripeSessionId, pendingPayment, createdByUser }`,
    { id: occurrenceId }
  );

  if (!occ || occ.createdByUser?._ref !== userId) {
    throw new Error('Not found or unauthorized');
  }

  if (occ.stripeSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(occ.stripeSessionId);
    if (existing.status === 'open') {
      return { paymentUrl: existing.url! };
    }
  }

  const paymentUrl = await startCheckoutForEvent({
    occurrenceId,
    title: occ.title,
    lang,
  });

  return { paymentUrl };
};

export const updateEvent = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Occurrence>;
}) => {
  await validateSession();
  const res = await sanityClient.patch(id).set(data).commit();
  revalidateTags([
    `eventSingle:${id}`,
    `eventSingleBySlug:${data.slug?.current}`,
  ]);
  return res;
};

export const getMonthlyEventCount = async ({ userId }: { userId: string; }) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  return await sanityClient.fetch<number>(
    eventMonthlyCountQuery,
    { userId, monthStart },
    { cache: 'no-store' }
  );
};

async function startCheckoutForEvent({
  occurrenceId,
  title,
  lang,
}: {
  occurrenceId: string;
  title?: string;
  lang: string;
}): Promise<string> {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3001';
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: `Pubblicazione evento: ${title ?? 'Nuovo evento'}` },
          unit_amount: PUBLISH_PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    metadata: { occurrenceId, eventTitle: title ?? '' },
    success_url: `${baseUrl}/${lang}/creator-admin/event/${occurrenceId}?payment=success`,
    cancel_url: `${baseUrl}/api/stripe/cancel?occurrenceId=${occurrenceId}&lang=${lang}`,
  });

  await sanityClient
    .patch(occurrenceId)
    .set({ stripeSessionId: checkoutSession.id })
    .commit()
    .catch((e) => {
      console.error('Failed to persist stripeSessionId on pending event:', e);
    });

  return checkoutSession.url!;
}

export const createEvent = async ({
  data,
  lang = 'it',
}: {
  data: Occurrence;
  lang?: string;
}) => {
  const session = await validateSession();
  const userId = session.user!.uid as string;

  const monthlyCount = await getMonthlyEventCount({ userId });

  if (monthlyCount >= 1) {
    const pendingData = { ...data, active: false, pendingPayment: true } as unknown as Occurrence;
    const pendingEvent = await sanityClient.create<Occurrence>(pendingData);

    try {
      const paymentUrl = await startCheckoutForEvent({
        occurrenceId: pendingEvent._id,
        title: data.title,
        lang,
      });
      return {
        _id: pendingEvent._id,
        requiresPayment: true as const,
        paymentUrl,
      };
    } catch (err) {
      await sanityClient.delete(pendingEvent._id).catch((e) => {
        console.error('Failed to rollback pending event after Stripe error:', e);
      });
      throw err;
    }
  }

  const res = await sanityClient.create<Occurrence>(data);

  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const freeThisMonth = await sanityClient.fetch<
    Array<{ _id: string; _createdAt: string; }>
  >(
    `*[_type == "occurrence" && createdByUser._ref == $userId && _createdAt >= $monthStart && pendingPayment != true] | order(_createdAt asc) {_id, _createdAt}`,
    { userId, monthStart },
    { cache: 'no-store' }
  );

  const firstFreeId = freeThisMonth[0]?._id;
  if (freeThisMonth.length > 1 && firstFreeId !== res._id) {
    await sanityClient
      .patch(res._id)
      .set({ active: false, pendingPayment: true })
      .commit();
    try {
      const paymentUrl = await startCheckoutForEvent({
        occurrenceId: res._id,
        title: data.title,
        lang,
      });
      return {
        _id: res._id,
        requiresPayment: true as const,
        paymentUrl,
      };
    } catch (err) {
      await sanityClient.delete(res._id).catch((e) => {
        console.error('Failed to rollback pending event after Stripe error:', e);
      });
      throw err;
    }
  }

  revalidateTags(['eventList']);
  return { ...res, requiresPayment: false as const };
};

export const getEventSingleHasAttendantById = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  return await sanityClient.fetch<{ hasAttendant: boolean; }>(
    eventSingleHasAttendantByEmailQuery,
    { eventId, email },
    { next: { tags: [`eventSingleHasAttendant:${eventId}`] } }
  );
};

export const getEventSingleHasAttendantByUuid = async ({
  eventId,
  uuid,
}: {
  eventId: string;
  uuid: string;
}) => {
  return await sanityClient.fetch<{ hasAttendant: boolean; }>(
    eventSingleHasAttendantByUuidQuery,
    { eventId, uuid },
    { next: { tags: [`eventSingleHasAttendant:${eventId}`] } }
  );
};

export const addEventAttendant = async ({
  eventId,
  eventAttendant,
}: {
  eventId: string;
  eventAttendant: Partial<EventAttendant>;
}) => {
  const validatedFields = eventAttendantSchema.safeParse(eventAttendant);

  if (!validatedFields.success) {
    throw new Error('generic');
  }

  const req = await request();
  const decision = await aj.protect(req, {
    email: validatedFields.data.email,
  });

  if (decision.isDenied()) {
    throw new Error('email_invalid');
  }

  const checkRes = await getEventSingleHasAttendantById({
    eventId,
    email: eventAttendant.email!,
  });

  if (checkRes.hasAttendant) {
    throw new Error('already_subscribed');
  }

  eventAttendant._type = 'eventAttendant';
  eventAttendant.uuid = uuidv4();
  eventAttendant.subcribitionDate = toUserIsoString(new Date());
  eventAttendant.paymentStatus = 'pending';

  const res = await sanityClient
    .patch(eventId)
    .setIfMissing({ attendants: [] })
    .prepend('attendants', [eventAttendant])
    .commit<Occurrence>();

  if (res) {
    revalidateTags([`eventSingle:${eventId}`]);
    return eventAttendant;
  }
};

export const removeEventAttendant = async ({
  eventId,
  eventAttendantUuid,
  alreadyUnsubscribedText = 'Attendant not subscribed',
}: {
  eventId: string;
  eventAttendantUuid: string;
  alreadyUnsubscribedText?: string;
}) => {
  const checkRes = await getEventSingleHasAttendantByUuid({
    eventId,
    uuid: eventAttendantUuid!,
  });

  if (!checkRes.hasAttendant) {
    throw new Error(alreadyUnsubscribedText);
  }

  const res = await sanityClient
    .patch(eventId)
    .unset([`attendants[uuid=="${eventAttendantUuid}"]`])
    .commit();

  revalidateTags([`eventSingle:${eventId}`]);
  return res;
};

export const updateEventAttendantStatus = async ({
  eventId,
  eventAttendantUuid,
  data,
}: {
  eventId: string;
  eventAttendantUuid: string;
  data: { checkedIn?: boolean; paymentStatus?: string; };
}) => {
  const checkRes = await getEventSingleHasAttendantByUuid({
    eventId,
    uuid: eventAttendantUuid,
  });

  if (!checkRes.hasAttendant) {
    throw new Error('Attendant not found');
  }

  // Create an object with the changes to apply
  const patches: Record<string, boolean | string> = {};
  if (data.checkedIn !== undefined) {
    patches[`attendants[uuid=="${eventAttendantUuid}"].checkedIn`] =
      data.checkedIn;
  }
  if (data.paymentStatus !== undefined) {
    patches[`attendants[uuid=="${eventAttendantUuid}"].paymentStatus`] =
      data.paymentStatus;
  }

  if (Object.keys(patches).length === 0) return;

  const res = await sanityClient.patch(eventId).set(patches).commit();

  revalidateTags([`eventSingle:${eventId}`]);
  return res;
};

type EventEmailData = {
  eventTitle: string;
  location?: string;
  talkTo?: string;
  price?: string;
  startDate?: string;
  endDate?: string;
  companyName: string;
  organizationSlug: string;
  eventSlug: string;
  organizerEmail?: string;
};

export const subscribeToEvent = async ({
  eventId,
  eventAttendant,
  lang,
  emailData,
}: {
  eventId: string;
  eventAttendant: Partial<EventAttendant>;
  lang: Locale;
  emailData: EventEmailData;
}) => {
  const result = await addEventAttendant({ eventId, eventAttendant });
  if (!result) return;

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const publicSlug = getPublicEventSlug(emailData.eventSlug, emailData.organizationSlug);
  const publicUrl = getPublicEventUrl(publicSlug);
  const token = createUnsubscribeToken({ eventId, uuid: result.uuid!, email: result.email! });
  const unsubscribeLink = `${baseUrl}/${lang}/pe/unsuscribe?eventSlug=${publicSlug}&t=${token}`;

  const emailDict = await getEmailDictionary(lang);
  const subDict = emailDict.event_attendant.subscription;

  const vars = {
    attendant_name: result.fullName ?? '',
    event_title: emailData.eventTitle,
    public_url: publicUrl,
    location: emailData.location ?? '--',
    talk_to: emailData.talkTo ?? '--',
    price: emailData.price ?? '--',
    currency: '',
    start_date: emailData.startDate ? new Date(emailData.startDate).toLocaleString() : '--',
    end_date: emailData.endDate ? new Date(emailData.endDate).toLocaleString() : '--',
    unsubscribe_link: unsubscribeLink,
    company_name: emailData.companyName,
  };

  await sendMail({
    sendTo: result.email!,
    subject: applyTemplate(subDict.subject, vars),
    text: applyTemplate(subDict.body_txt, vars),
    html: applyTemplate(subDict.body_html, vars),
  });

  if (emailData.organizerEmail) {
    const orgDict = emailDict.organizer.new_attendant;
    const orgVars = {
      event_title: emailData.eventTitle,
      attendant_name: result.fullName ?? '',
      attendant_email: result.email ?? '',
    };
    await sendMail({
      sendTo: emailData.organizerEmail,
      subject: applyTemplate(orgDict.subject, orgVars),
      text: applyTemplate(orgDict.body_txt, orgVars),
      html: applyTemplate(orgDict.body_html, orgVars),
    });
  }

  return result;
};

export const unsubscribeFromEvent = async ({
  eventId,
  eventAttendantUuid,
  eventAttendantEmail,
  lang,
  emailData,
  alreadyUnsubscribedText,
}: {
  eventId: string;
  eventAttendantUuid: string;
  eventAttendantEmail: string;
  lang: Locale;
  emailData: Pick<EventEmailData, 'eventTitle' | 'companyName' | 'organizationSlug' | 'eventSlug'>;
  alreadyUnsubscribedText?: string;
}) => {
  const result = await removeEventAttendant({ eventId, eventAttendantUuid, alreadyUnsubscribedText });

  const publicSlug = getPublicEventSlug(emailData.eventSlug, emailData.organizationSlug);
  const publicUrl = getPublicEventUrl(publicSlug);

  const emailDict = await getEmailDictionary(lang);
  const unsubDict = emailDict.event_attendant.unsubscription;

  const vars = {
    event_title: emailData.eventTitle,
    company_name: emailData.companyName,
    public_url: publicUrl,
  };

  await sendMail({
    sendTo: eventAttendantEmail,
    subject: applyTemplate(unsubDict.subject, vars),
    text: applyTemplate(unsubDict.body_txt, vars),
    html: applyTemplate(unsubDict.body_html, vars),
  });

  return result;
};

export const requestAccountDeletion = async ({ lang }: { lang: Locale }) => {
  const session = await validateSession();
  const userId = session.user!.uid as string;
  const email = session.user!.email as string;

  const token = createDeleteAccountToken({ userId, email, lang });
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const confirmUrl = `${baseUrl}/api/user/delete-confirm?t=${token}`;

  await sendMail({
    sendTo: email,
    subject: 'FisEvents — Confirm account deletion',
    text: `You requested to delete your FisEvents account.\n\nClick this link to confirm (expires in 1 hour):\n${confirmUrl}\n\nIf you did not request this, ignore this email.`,
    html: `<h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Confirm account deletion</h2><p style="margin:0 0 12px;">You requested to permanently delete your FisEvents account and all associated data (events, registrations).</p><p style="margin:0 0 12px;color:#b91c1c;"><strong>This action cannot be undone.</strong></p><p style="margin:20px 0;"><a href="${confirmUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Confirm deletion</a></p><p style="margin:20px 0 0;font-size:13px;color:#9ca3af;">This link expires in 1 hour. If you did not request this, ignore this email — your account is safe.</p>`,
  });
};
