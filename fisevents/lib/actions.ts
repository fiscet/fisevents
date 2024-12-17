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
  userQueryBySlug
} from './queries';
import {
  CurrentUser,
  OccurrenceList,
  OccurrenceSingle,
  PublicOccurrenceSingle
} from '@/types/sanity.extended.types';
import {
  EventAttendant,
  Occurrence,
  User
} from '@/types/sanity.types';
import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { toUserIsoString } from './utils';

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
  data
}: {
  id: string;
  data: Partial<User>;
}) => {
  const res = await sanityClient.patch(id).set(data).commit();

  revalidateTag('user');

  return res;
};

/** EVENTS */
export const getEventIdList = async ({
  active = true
}: {
  active?: boolean;
}) => {
  return await sanityClient.fetch<{ _id: string; }[]>(
    eventIdQuery,
    { active },
    { next: { tags: ['eventSlugList'] } }
  );
};


export const getEventList = async ({
  createdBy,
  active = true
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
  id
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

export const updateEvent = async ({
  id,
  data
}: {
  id: string;
  data: Partial<Occurrence>;
}) => {
  const res = await sanityClient.patch(id).set(data).commit();

  revalidateTag(`eventSingle:${id}`);
  revalidateTag(`eventSingleBySlug:${data.slug?.current}`);

  return res;
};

export const createEvent = async ({ data }: { data: Occurrence; }) => {
  const res = await sanityClient.create<Occurrence>(data);

  revalidateTag('eventList');

  return res;
};

export const getEventSingleHasAttendantById = async ({
  eventId,
  email
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
  uuid
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
  eventAttendant
}: {
  eventId: string;
  eventAttendant: Partial<EventAttendant>;
}) => {
  const checkRes = await getEventSingleHasAttendantById({
    eventId,
    email: eventAttendant.email!
  });

  if (checkRes.hasAttendant) {
    throw new Error('Attendant already subscribed');
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
    revalidateTag(`eventSingle:${eventId}`);

    return eventAttendant;
  }
};

export const removeEventAttendant = async ({
  eventId,
  eventAttendantUuid,
  alreadyUnsubscribedText = 'Attendant not subscribed'
}: {
  eventId: string;
  eventAttendantUuid: string;
  alreadyUnsubscribedText?: string;
}) => {
  const checkRes = await getEventSingleHasAttendantByUuid({
    eventId,
    uuid: eventAttendantUuid!
  });

  if (!checkRes.hasAttendant) {
    throw new Error(alreadyUnsubscribedText);
  }

  const res = await sanityClient
    .patch(eventId)
    .unset([`attendants[uuid=="${eventAttendantUuid}"]`])
    .commit();

  revalidateTag(`eventSingle:${eventId}`);

  return res;
};
