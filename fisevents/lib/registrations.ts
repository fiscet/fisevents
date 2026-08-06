import { sanityClient } from '@/lib/sanity.cli';
import { v4 as uuidv4 } from 'uuid';
import { toUserIsoString } from '@/lib/utils';
import type { EventAttendant, Registration } from '@/types/sanity.types';

// The shared client uses the CDN in production, which can serve stale reads.
// Capacity enforcement reads the live attendant count right before writing, so
// it must bypass the CDN; writes go to the API regardless.
const liveClient = sanityClient.withConfig({ useCdn: false });

const MAX_CAPACITY_RETRIES = 5;

/** How long a waitlisted person has to accept an offered spot before it moves on. */
export const WAITLIST_OFFER_WINDOW_HOURS = 24;

type AttendantInput = Partial<EventAttendant>;
type RegistrationStatus = NonNullable<Registration['status']>;

/** Sanity returns HTTP 409 when an `ifRevisionId` precondition fails. */
function isRevisionConflict(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    (err as { statusCode?: number }).statusCode === 409
  );
}

function normalizeCustomFieldValues(input?: AttendantInput['customFieldValues']) {
  if (!input?.length) return undefined;
  const normalized = input
    .filter((v) => v && v.name && v.value !== undefined && v.value !== '')
    .map((v) => ({
      _type: 'customFieldValue' as const,
      _key: uuidv4(),
      name: v.name,
      label: v.label,
      value: v.value,
    }));
  return normalized.length ? normalized : undefined;
}

function buildRegistrationDoc(
  eventId: string,
  attendant: AttendantInput,
  status: RegistrationStatus
) {
  const customFieldValues = normalizeCustomFieldValues(attendant.customFieldValues);

  return {
    _id: uuidv4(),
    _type: 'registration' as const,
    occurrence: { _type: 'reference' as const, _ref: eventId, _weak: true },
    fullName: attendant.fullName,
    email: attendant.email,
    phone: attendant.phone,
    privacyAccepted: attendant.privacyAccepted ?? false,
    uuid: uuidv4(),
    subcribitionDate: toUserIsoString(new Date()),
    paymentStatus: 'pending' as const,
    checkedIn: false,
    status,
    ...(customFieldValues ? { customFieldValues } : {}),
  };
}

/**
 * Creates a registration document and atomically bumps the event's
 * `attendantsCount`. When `enforceCapacity` is true the count is guarded by an
 * optimistic-concurrency check (read rev → verify capacity → write guarded by
 * that rev) and retried on conflict, so concurrent sign-ups can never oversell.
 */
export async function createRegistration({
  eventId,
  attendant,
  enforceCapacity = true,
}: {
  eventId: string;
  attendant: AttendantInput;
  enforceCapacity?: boolean;
}): Promise<Registration> {
  const doc = buildRegistrationDoc(eventId, attendant, 'confirmed');

  for (let attempt = 0; attempt < MAX_CAPACITY_RETRIES; attempt++) {
    const occ = await liveClient.fetch<{
      _id: string;
      _rev: string;
      maxSubscribers?: number;
      attendantsCount?: number;
    } | null>(
      `*[_type == "occurrence" && _id == $id][0]{ _id, _rev, maxSubscribers, attendantsCount }`,
      { id: eventId },
      { cache: 'no-store' }
    );

    if (!occ) throw new Error('generic');

    const count = occ.attendantsCount ?? 0;
    const max = occ.maxSubscribers ?? 0;
    if (enforceCapacity && max > 0 && count >= max) {
      throw new Error('event_full');
    }

    try {
      await liveClient
        .transaction()
        .create(doc)
        .patch(eventId, (p) =>
          p.ifRevisionId(occ._rev).set({ attendantsCount: count + 1 })
        )
        .commit({ visibility: 'async' });

      return doc as Registration;
    } catch (err) {
      // Someone else changed the event between our read and write — retry with
      // a fresh count/revision. Any other error is fatal.
      if (isRevisionConflict(err) && attempt < MAX_CAPACITY_RETRIES - 1) {
        continue;
      }
      throw err;
    }
  }

  // Exhausted retries under sustained contention.
  throw new Error('event_full');
}

export async function hasRegistrationByEmail({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}): Promise<boolean> {
  const count = await liveClient.fetch<number>(
    `count(*[_type == "registration" && occurrence._ref == $eventId && email == $email])`,
    { eventId, email },
    { cache: 'no-store' }
  );
  return count > 0;
}

export async function getRegistrationByUuid({
  eventId,
  uuid,
}: {
  eventId: string;
  uuid: string;
}): Promise<{ _id: string; status?: RegistrationStatus } | null> {
  return liveClient.fetch<{ _id: string; status?: RegistrationStatus } | null>(
    `*[_type == "registration" && occurrence._ref == $eventId && uuid == $uuid][0]{ _id, status }`,
    { eventId, uuid },
    { cache: 'no-store' }
  );
}

/**
 * Deletes a registration. Registrations without a `status` predate this field
 * and were always confirmed, so they're treated as spot-holding too.
 * Confirmed/offered registrations hold a counted spot: deleting one frees it,
 * so the event counter is decremented and the next waitlisted person (if any)
 * is offered the newly-freed spot. Waitlisted/expired registrations don't hold
 * a spot, so deleting them is a plain delete.
 */
export async function deleteRegistration({
  eventId,
  registrationId,
  status,
}: {
  eventId: string;
  registrationId: string;
  status?: RegistrationStatus;
}): Promise<Registration | null> {
  const heldSpot = status === undefined || status === 'confirmed' || status === 'offered';

  if (!heldSpot) {
    await liveClient.transaction().delete(registrationId).commit();
    return null;
  }

  // Sync visibility (unlike the async writes above) so the promotion check
  // right after this reads the post-delete count, not a stale one — deletions
  // are infrequent enough that the extra latency doesn't matter.
  await liveClient
    .transaction()
    .delete(registrationId)
    .patch(eventId, (p) => p.dec({ attendantsCount: 1 }))
    .commit();

  return promoteNextWaitlisted(eventId);
}

/**
 * Adds an attendant to the waitlist. Waitlisted registrations don't hold a
 * counted spot — they only reserve one once `promoteNextWaitlisted` offers it
 * to them — so this is a plain create with no capacity check.
 */
export async function joinWaitlist({
  eventId,
  attendant,
}: {
  eventId: string;
  attendant: AttendantInput;
}): Promise<Registration> {
  const doc = buildRegistrationDoc(eventId, attendant, 'waitlisted');
  await liveClient.create(doc);
  return doc as Registration;
}

/**
 * Offers a freed spot to the longest-waiting person on the waitlist. The offer
 * counts toward `attendantsCount` immediately (same as a confirmed spot) so a
 * concurrent public sign-up can't take the seat out from under them during the
 * acceptance window; if they don't accept in time, `expireOffer` releases it.
 * No-ops if the event has no free capacity or nobody is waiting. Guarded the
 * same way as `createRegistration`: read rev → verify capacity → write guarded
 * by that rev, retried on conflict.
 */
export async function promoteNextWaitlisted(eventId: string): Promise<Registration | null> {
  for (let attempt = 0; attempt < MAX_CAPACITY_RETRIES; attempt++) {
    const occ = await liveClient.fetch<{
      _id: string;
      _rev: string;
      maxSubscribers?: number;
      attendantsCount?: number;
    } | null>(
      `*[_type == "occurrence" && _id == $id][0]{ _id, _rev, maxSubscribers, attendantsCount }`,
      { id: eventId },
      { cache: 'no-store' }
    );

    if (!occ) return null;

    const count = occ.attendantsCount ?? 0;
    const max = occ.maxSubscribers ?? 0;
    if (max <= 0 || count >= max) return null;

    const next = await liveClient.fetch<Registration | null>(
      `*[_type == "registration" && occurrence._ref == $eventId && status == "waitlisted"] | order(subcribitionDate asc)[0]`,
      { eventId },
      { cache: 'no-store' }
    );
    if (!next) return null;

    const offerExpiresAt = new Date(
      Date.now() + WAITLIST_OFFER_WINDOW_HOURS * 60 * 60 * 1000
    ).toISOString();

    try {
      await liveClient
        .transaction()
        .patch(next._id, (p) => p.set({ status: 'offered', offerExpiresAt }))
        .patch(eventId, (p) => p.ifRevisionId(occ._rev).set({ attendantsCount: count + 1 }))
        .commit();

      return { ...next, status: 'offered', offerExpiresAt };
    } catch (err) {
      if (isRevisionConflict(err) && attempt < MAX_CAPACITY_RETRIES - 1) {
        continue;
      }
      throw err;
    }
  }

  return null;
}

/**
 * Called by the expiry cron for a registration whose offer window has passed
 * without a response. Releases the reserved spot and tries to hand it to the
 * next person in line. Guarded by `_rev` in case the attendant accepted the
 * offer in the moment between the cron's query and this call — in that case
 * the registration is no longer 'offered' and expiry is skipped.
 */
export async function expireOffer({
  eventId,
  registrationId,
}: {
  eventId: string;
  registrationId: string;
}): Promise<Registration | null> {
  const current = await liveClient.fetch<{ _rev: string; status?: RegistrationStatus } | null>(
    `*[_id == $registrationId][0]{ _rev, status }`,
    { registrationId },
    { cache: 'no-store' }
  );
  if (!current || current.status !== 'offered') return null;

  try {
    await liveClient
      .transaction()
      .patch(registrationId, (p) =>
        p.ifRevisionId(current._rev).set({ status: 'expired' }).unset(['offerExpiresAt'])
      )
      .patch(eventId, (p) => p.dec({ attendantsCount: 1 }))
      .commit();
  } catch (err) {
    if (isRevisionConflict(err)) return null;
    throw err;
  }

  return promoteNextWaitlisted(eventId);
}

/**
 * Confirms a waitlist offer. The offer already reserved the spot (counted in
 * `attendantsCount` since `promoteNextWaitlisted`), so accepting is just a
 * status flip — no capacity math needed here.
 */
export async function acceptWaitlistOffer({
  eventId,
  uuid,
}: {
  eventId: string;
  uuid: string;
}): Promise<Registration> {
  const registration = await liveClient.fetch<
    Pick<Registration, 'fullName' | 'email' | 'uuid'> & {
      _id: string;
      _rev: string;
      status?: RegistrationStatus;
      offerExpiresAt?: string;
    } | null
  >(
    `*[_type == "registration" && occurrence._ref == $eventId && uuid == $uuid][0]{ _id, _rev, fullName, email, uuid, status, offerExpiresAt }`,
    { eventId, uuid },
    { cache: 'no-store' }
  );

  if (!registration) throw new Error('not_found');
  if (registration.status !== 'offered') throw new Error('offer_not_available');
  if (!registration.offerExpiresAt || new Date(registration.offerExpiresAt) <= new Date()) {
    throw new Error('offer_expired');
  }

  try {
    await liveClient
      .patch(registration._id)
      .ifRevisionId(registration._rev)
      .set({ status: 'confirmed' })
      .unset(['offerExpiresAt'])
      .commit();
  } catch (err) {
    // The cron expired this offer in the moment between our read and write.
    if (isRevisionConflict(err)) throw new Error('offer_expired');
    throw err;
  }

  return { ...registration, status: 'confirmed' } as Registration;
}

export async function setRegistrationStatus({
  registrationId,
  data,
}: {
  registrationId: string;
  data: { checkedIn?: boolean; paymentStatus?: string };
}) {
  return liveClient.patch(registrationId).set(data).commit();
}

/** Deletes an event together with all its registrations (no orphans). */
export async function deleteOccurrenceCascade(eventId: string) {
  const registrationIds = await liveClient.fetch<string[]>(
    `*[_type == "registration" && occurrence._ref == $eventId]._id`,
    { eventId },
    { cache: 'no-store' }
  );

  const tx = liveClient.transaction();
  registrationIds.forEach((id) => tx.delete(id));
  tx.delete(eventId);
  return tx.commit();
}
