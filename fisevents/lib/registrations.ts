import { sanityClient } from '@/lib/sanity.cli';
import { v4 as uuidv4 } from 'uuid';
import { toUserIsoString } from '@/lib/utils';
import type { EventAttendant, Registration } from '@/types/sanity.types';

// The shared client uses the CDN in production, which can serve stale reads.
// Capacity enforcement reads the live attendant count right before writing, so
// it must bypass the CDN; writes go to the API regardless.
const liveClient = sanityClient.withConfig({ useCdn: false });

const MAX_CAPACITY_RETRIES = 5;

type AttendantInput = Partial<EventAttendant>;

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
  const customFieldValues = normalizeCustomFieldValues(attendant.customFieldValues);

  const doc = {
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
    ...(customFieldValues ? { customFieldValues } : {}),
  };

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
}): Promise<{ _id: string } | null> {
  return liveClient.fetch<{ _id: string } | null>(
    `*[_type == "registration" && occurrence._ref == $eventId && uuid == $uuid][0]{ _id }`,
    { eventId, uuid },
    { cache: 'no-store' }
  );
}

/** Deletes a registration and decrements the event counter atomically. */
export async function deleteRegistration({
  eventId,
  registrationId,
}: {
  eventId: string;
  registrationId: string;
}) {
  return liveClient
    .transaction()
    .delete(registrationId)
    .patch(eventId, (p) => p.dec({ attendantsCount: 1 }))
    .commit({ visibility: 'async' });
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
