'use server';

import { sanityClient } from './sanity.cli';
import {
  eventListQuery,
  eventSingleByIdQuery,
  eventSingleBySlugQuery,
  eventSingleHasAttendantByEmailQuery,
  eventSingleHasAttendantByUuidQuery,
  eventIdQuery,
  userQuery,
  userQueryBySlug,
} from './queries';
import {
  CurrentUser,
  OccurrenceList,
  OccurrenceSingle,
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

const aj = arcjet.withRule(
  validateEmail({
    mode: 'LIVE',
    block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
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
export const getUserById = async ({ userId }: { userId: string }) => {
  return await sanityClient.fetch<CurrentUser>(
    userQuery,
    { userId },
    { next: { tags: ['user'] } }
  );
};

export const getUserBySlug = async ({ slug }: { slug: string }) => {
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
  return await sanityClient.fetch<{ _id: string }[]>(
    eventIdQuery,
    { active },
    { next: { tags: ['eventSlugList'] } }
  );
};

export const getEventList = async ({
  createdBy,
  active = true,
}: {
  createdBy: string;
  active?: boolean;
}) => {
  return await sanityClient.fetch<OccurrenceList[]>(
    eventListQuery,
    { createdBy, active },
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

export const getEventSingleBySlug = async ({ slug }: { slug: string }) => {
  return await sanityClient.fetch<PublicOccurrenceSingle>(
    eventSingleBySlugQuery,
    { publicSlug: slug },
    { next: { tags: [`eventSingleBySlug:${slug}`] } }
  );
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

export const createEvent = async ({ data }: { data: Occurrence }) => {
  await validateSession();
  const res = await sanityClient.create<Occurrence>(data);
  revalidateTags(['eventList']);
  return res;
};

export const getEventSingleHasAttendantById = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  return await sanityClient.fetch<{ hasAttendant: boolean }>(
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
  return await sanityClient.fetch<{ hasAttendant: boolean }>(
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
  data: { checkedIn?: boolean; paymentStatus?: string };
}) => {
  const checkRes = await getEventSingleHasAttendantByUuid({
    eventId,
    uuid: eventAttendantUuid,
  });

  if (!checkRes.hasAttendant) {
    throw new Error('Attendant not found');
  }

  // Create an object with the changes to apply
  const patches: any = {};
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
