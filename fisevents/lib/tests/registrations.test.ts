import {
  joinWaitlist,
  promoteNextWaitlisted,
  deleteRegistration,
  expireOffer,
  acceptWaitlistOffer,
} from '../registrations';
import { sanityClient } from '../sanity.cli';

jest.mock('../sanity.cli', () => {
  const client: Record<string, jest.Mock> = {
    fetch: jest.fn(),
    patch: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    transaction: jest.fn(),
    withConfig: jest.fn(),
  };
  client.withConfig.mockReturnValue(client);
  return { sanityClient: client };
});

// Mocks the chainable Sanity transaction used by registrations.ts:
// transaction().patch(...).patch(...).commit() / .delete(...).patch(...).commit()
function makeTransactionMock(commitResult: object = {}) {
  const commit = jest.fn().mockResolvedValue(commitResult);
  const tx = {
    create: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    commit,
  } as Record<string, jest.Mock>;
  tx.create.mockReturnValue(tx);
  tx.patch.mockReturnValue(tx);
  tx.delete.mockReturnValue(tx);
  return { tx, commit };
}

// Mocks the fluent (non-transaction) patch builder used by acceptWaitlistOffer:
// patch(id).ifRevisionId(rev).set(...).unset(...).commit()
function makeFluentPatchMock(commitResult: object = {}) {
  const commit = jest.fn().mockResolvedValue(commitResult);
  const patchObj: Record<string, jest.Mock> = { commit };
  ['ifRevisionId', 'set', 'unset'].forEach((method) => {
    patchObj[method] = jest.fn().mockReturnValue(patchObj);
  });
  return { patchObj, commit };
}

describe('registrations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('joinWaitlist', () => {
    it('creates a waitlisted registration without touching capacity', async () => {
      (sanityClient.create as jest.Mock).mockResolvedValue({});

      const result = await joinWaitlist({
        eventId: 'evt-1',
        attendant: { fullName: 'Jane Doe', email: 'jane@example.com' },
      });

      expect(result.status).toBe('waitlisted');
      expect(sanityClient.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'waitlisted', occurrence: { _type: 'reference', _ref: 'evt-1', _weak: true } })
      );
      expect(sanityClient.transaction).not.toHaveBeenCalled();
    });
  });

  describe('promoteNextWaitlisted', () => {
    it('no-ops when the event has no free capacity', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({
        _id: 'evt-1',
        _rev: 'rev-1',
        maxSubscribers: 2,
        attendantsCount: 2,
      });

      const result = await promoteNextWaitlisted('evt-1');

      expect(result).toBeNull();
      // Only the occurrence was read — no point looking up a waitlisted person.
      expect(sanityClient.fetch).toHaveBeenCalledTimes(1);
      expect(sanityClient.transaction).not.toHaveBeenCalled();
    });

    it('no-ops when nobody is waiting', async () => {
      (sanityClient.fetch as jest.Mock)
        .mockResolvedValueOnce({ _id: 'evt-1', _rev: 'rev-1', maxSubscribers: 2, attendantsCount: 1 })
        .mockResolvedValueOnce(null); // no waitlisted registration found

      const result = await promoteNextWaitlisted('evt-1');

      expect(result).toBeNull();
      expect(sanityClient.transaction).not.toHaveBeenCalled();
    });

    it('offers the freed spot to the longest-waiting person and reserves the seat', async () => {
      (sanityClient.fetch as jest.Mock)
        .mockResolvedValueOnce({ _id: 'evt-1', _rev: 'rev-1', maxSubscribers: 2, attendantsCount: 1 })
        .mockResolvedValueOnce({ _id: 'reg-2', email: 'next@example.com', fullName: 'Next Person', status: 'waitlisted' });
      const { tx } = makeTransactionMock();
      (sanityClient.transaction as jest.Mock).mockReturnValue(tx);

      const result = await promoteNextWaitlisted('evt-1');

      expect(result?.status).toBe('offered');
      expect(result?.offerExpiresAt).toBeDefined();
      expect(tx.patch).toHaveBeenCalledWith('reg-2', expect.any(Function));
      expect(tx.patch).toHaveBeenCalledWith('evt-1', expect.any(Function));
      expect(tx.commit).toHaveBeenCalled();
    });
  });

  describe('deleteRegistration', () => {
    it('does a plain delete for a waitlisted registration (no capacity change)', async () => {
      const { tx } = makeTransactionMock();
      (sanityClient.transaction as jest.Mock).mockReturnValue(tx);

      const result = await deleteRegistration({
        eventId: 'evt-1',
        registrationId: 'reg-1',
        status: 'waitlisted',
      });

      expect(result).toBeNull();
      expect(tx.delete).toHaveBeenCalledWith('reg-1');
      expect(tx.patch).not.toHaveBeenCalled();
    });

    it('decrements the counter and tries to promote the next waitlisted person for a confirmed registration', async () => {
      const { tx } = makeTransactionMock();
      (sanityClient.transaction as jest.Mock).mockReturnValue(tx);
      // promoteNextWaitlisted's own occurrence read, right after the delete
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({
        _id: 'evt-1',
        _rev: 'rev-2',
        maxSubscribers: 2,
        attendantsCount: 1,
      });
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(null); // nobody waiting

      const result = await deleteRegistration({
        eventId: 'evt-1',
        registrationId: 'reg-1',
        status: 'confirmed',
      });

      expect(result).toBeNull();
      expect(tx.delete).toHaveBeenCalledWith('reg-1');
      expect(tx.patch).toHaveBeenCalledWith('evt-1', expect.any(Function));
      expect(tx.commit).toHaveBeenCalled();
    });

    it('treats a registration without a status as confirmed (legacy data)', async () => {
      const { tx } = makeTransactionMock();
      (sanityClient.transaction as jest.Mock).mockReturnValue(tx);
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({
        _id: 'evt-1',
        _rev: 'rev-2',
        maxSubscribers: 2,
        attendantsCount: 1,
      });
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(null);

      await deleteRegistration({ eventId: 'evt-1', registrationId: 'reg-1' });

      expect(tx.patch).toHaveBeenCalledWith('evt-1', expect.any(Function));
    });
  });

  describe('expireOffer', () => {
    it('expires the offer, releases the seat, and tries to promote the next person', async () => {
      (sanityClient.fetch as jest.Mock)
        .mockResolvedValueOnce({ _rev: 'rev-1', status: 'offered' }) // current registration
        .mockResolvedValueOnce({ _id: 'evt-1', _rev: 'rev-2', maxSubscribers: 2, attendantsCount: 1 }) // promoteNextWaitlisted
        .mockResolvedValueOnce(null); // nobody waiting
      const { tx } = makeTransactionMock();
      (sanityClient.transaction as jest.Mock).mockReturnValue(tx);

      const result = await expireOffer({ eventId: 'evt-1', registrationId: 'reg-1' });

      expect(result).toBeNull();
      expect(tx.patch).toHaveBeenCalledWith('reg-1', expect.any(Function));
      expect(tx.patch).toHaveBeenCalledWith('evt-1', expect.any(Function));
      expect(tx.commit).toHaveBeenCalled();
    });

    it('skips expiry when the offer was already accepted (race with the cron)', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({ _rev: 'rev-1', status: 'confirmed' });

      const result = await expireOffer({ eventId: 'evt-1', registrationId: 'reg-1' });

      expect(result).toBeNull();
      expect(sanityClient.transaction).not.toHaveBeenCalled();
    });
  });

  describe('acceptWaitlistOffer', () => {
    it('confirms a valid, unexpired offer', async () => {
      const futureIso = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({
        _id: 'reg-1',
        _rev: 'rev-1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        uuid: 'uuid-1',
        status: 'offered',
        offerExpiresAt: futureIso,
      });
      const { patchObj } = makeFluentPatchMock();
      (sanityClient.patch as jest.Mock).mockReturnValue(patchObj);

      const result = await acceptWaitlistOffer({ eventId: 'evt-1', uuid: 'uuid-1' });

      expect(result.status).toBe('confirmed');
      expect(sanityClient.patch).toHaveBeenCalledWith('reg-1');
      expect(patchObj.ifRevisionId).toHaveBeenCalledWith('rev-1');
      expect(patchObj.set).toHaveBeenCalledWith({ status: 'confirmed' });
      expect(patchObj.commit).toHaveBeenCalled();
    });

    it('rejects an offer past its expiry window', async () => {
      const pastIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({
        _id: 'reg-1',
        _rev: 'rev-1',
        status: 'offered',
        offerExpiresAt: pastIso,
      });

      await expect(acceptWaitlistOffer({ eventId: 'evt-1', uuid: 'uuid-1' })).rejects.toThrow(
        'offer_expired'
      );
    });

    it('rejects when the registration is not in an offered state', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce({
        _id: 'reg-1',
        _rev: 'rev-1',
        status: 'waitlisted',
      });

      await expect(acceptWaitlistOffer({ eventId: 'evt-1', uuid: 'uuid-1' })).rejects.toThrow(
        'offer_not_available'
      );
    });

    it('rejects when the registration no longer exists', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(null);

      await expect(acceptWaitlistOffer({ eventId: 'evt-1', uuid: 'uuid-1' })).rejects.toThrow(
        'not_found'
      );
    });
  });
});
