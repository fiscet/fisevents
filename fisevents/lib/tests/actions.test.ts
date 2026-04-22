import { Occurrence } from '@/types/sanity.types';
import {
  getEventList,
  getEventSingleById,
  updateEvent,
  createEvent,
  resumeOrCreateCheckout,
} from '../actions';
import { sanityClient } from '../sanity.cli';
import { stripe } from '../stripe';
import { getSession } from '@/lib/auth';
import { OccurrenceList, OccurrenceSingle } from '@/types/sanity.extended.types';
import { revalidateTag } from 'next/cache';

jest.mock('../sanity.cli', () => ({
  sanityClient: {
    fetch: jest.fn(),
    patch: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}));

jest.mock('../stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
    },
  },
  PUBLISH_PRICE_CENTS: 470,
}));

jest.mock('@/lib/arcjet', () => {
  const mockAj = {
    withRule: jest.fn(),
    protect: jest.fn().mockResolvedValue({ isDenied: () => false }),
  };
  mockAj.withRule.mockReturnValue(mockAj);
  return {
    __esModule: true,
    default: mockAj,
    validateEmail: jest.fn().mockReturnValue({}),
  };
});

jest.mock('@arcjet/next', () => ({
  request: jest.fn(),
}));

jest.mock('@/lib/send-mail', () => ({
  sendMail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/i18n.utils', () => ({
  getEmailDictionary: jest.fn(),
  getDictionary: jest.fn(),
}));

const mockSession = { user: { uid: 'user-123', email: 'test@example.com' } };

function makePatchMock(resolvedValue: object = {}) {
  const commitMock = jest.fn().mockResolvedValue(resolvedValue);
  const setMock = jest.fn().mockReturnValue({ commit: commitMock });
  const patchMock = jest.fn().mockReturnValue({ set: setMock, commit: commitMock });
  return { patchMock, setMock, commitMock };
}

describe('Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEventList', () => {
    it('fetches event list', async () => {
      const mockData: OccurrenceList[] = [
        {
          startDate: '2024-08-14T15:37:00+02:00',
          endDate: '2024-08-15T04:31:00+02:00',
          publicationStartDate: '2024-08-13T14:30:00+02:00',
          numAttendants: 1,
          _id: '13b54393-fe75-42cf-a301-c7ccf57c497c',
          title: 'Where are you going?',
          slug: { current: 'where-can-i-get-some', _type: 'slug' },
        },
      ];
      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockData);

      const result = await getEventList({ createdBy: 'user1' });

      expect(sanityClient.fetch).toHaveBeenCalledWith(
        expect.anything(),
        { createdBy: 'user1' },
        { next: { tags: ['eventList'] } }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getEventSingleById', () => {
    it('fetches single event', async () => {
      const mockData: OccurrenceSingle = {
        _id: '13b54393',
        title: 'Test Event',
        active: true,
        endDate: '2024-08-15T04:31:00+02:00',
        startDate: '2024-08-14T15:37:00+02:00',
        publicationStartDate: '2024-08-13T14:30:00+02:00',
        maxSubscribers: 10,
        basicPrice: 50,
        currency: 'EUR',
        subcribers: [],
      } as unknown as OccurrenceSingle;
      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockData);

      const id = '13b54393';
      const result = await getEventSingleById({ createdBy: 'user1', id });

      expect(sanityClient.fetch).toHaveBeenCalledWith(
        expect.anything(),
        { createdBy: 'user1', id },
        { next: { tags: [`eventSingle:${id}`] } }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('updateEvent', () => {
    it('updates event and revalidates tags', async () => {
      const mockResult = { _id: '1', title: 'Updated Event' };
      const { patchMock, setMock, commitMock } = makePatchMock(mockResult);
      (sanityClient.patch as jest.Mock).mockImplementation(patchMock);
      (getSession as jest.Mock).mockResolvedValue(mockSession);

      const data: Partial<Occurrence> = { title: 'Updated Event' };
      const result = await updateEvent({ id: '1', data });

      expect(sanityClient.patch).toHaveBeenCalledWith('1');
      expect(setMock).toHaveBeenCalledWith(data);
      expect(commitMock).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalledWith('eventSingle:1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('createEvent', () => {
    const baseEventData = {
      _type: 'occurrence' as const,
      title: 'Test Event',
      createdByUser: { _ref: 'user-123', _type: 'reference' as const },
    } as unknown as Occurrence;

    beforeEach(() => {
      (getSession as jest.Mock).mockResolvedValue(mockSession);
    });

    it('creates a free event when monthly count is 0', async () => {
      const createdEvent = { ...baseEventData, _id: 'new-event-id' };

      (sanityClient.fetch as jest.Mock)
        .mockResolvedValueOnce(0) // monthlyCount
        .mockResolvedValueOnce([{ _id: 'new-event-id', _createdAt: '2024-01-01T00:00:00Z' }]); // race check: only this event

      (sanityClient.create as jest.Mock).mockResolvedValue(createdEvent);
      (revalidateTag as jest.Mock).mockReturnValue(undefined);

      const result = await createEvent({ data: baseEventData });

      expect(sanityClient.create).toHaveBeenCalledWith(baseEventData);
      expect(revalidateTag).toHaveBeenCalledWith('eventList');
      expect(result).toMatchObject({ _id: 'new-event-id', requiresPayment: false });
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    });

    it('creates a paid event when monthly count is 1 or more', async () => {
      const createdEvent = { ...baseEventData, _id: 'pending-event-id' };
      const { patchMock, setMock, commitMock } = makePatchMock({});
      (sanityClient.patch as jest.Mock).mockImplementation(patchMock);

      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(1); // monthlyCount >= 1
      (sanityClient.create as jest.Mock).mockResolvedValue(createdEvent);
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: 'stripe-sess-id',
        url: 'https://checkout.stripe.com/pay/test',
      });

      const result = await createEvent({ data: baseEventData });

      expect(sanityClient.create).toHaveBeenCalledWith(
        expect.objectContaining({ active: false, pendingPayment: true })
      );
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({ occurrenceId: 'pending-event-id' }),
        })
      );
      expect(result).toMatchObject({
        _id: 'pending-event-id',
        requiresPayment: true,
        paymentUrl: 'https://checkout.stripe.com/pay/test',
      });
    });

    it('rolls back the pending event when Stripe fails', async () => {
      const createdEvent = { ...baseEventData, _id: 'pending-event-id' };
      const stripeError = new Error('Stripe unavailable');
      const { patchMock } = makePatchMock({});
      (sanityClient.patch as jest.Mock).mockImplementation(patchMock);

      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(1);
      (sanityClient.create as jest.Mock).mockResolvedValue(createdEvent);
      (stripe.checkout.sessions.create as jest.Mock).mockRejectedValue(stripeError);
      (sanityClient.delete as jest.Mock).mockResolvedValue({});

      await expect(createEvent({ data: baseEventData })).rejects.toThrow('Stripe unavailable');
      expect(sanityClient.delete).toHaveBeenCalledWith('pending-event-id');
    });

    it('detects race condition and charges when another free event exists this month', async () => {
      const myEvent = { ...baseEventData, _id: 'my-event-id' };
      const { patchMock, setMock, commitMock } = makePatchMock({});
      (sanityClient.patch as jest.Mock).mockImplementation(patchMock);

      (sanityClient.fetch as jest.Mock)
        .mockResolvedValueOnce(0) // monthlyCount = 0 at create time
        .mockResolvedValueOnce([
          // race check: another event was first
          { _id: 'other-event-id', _createdAt: '2024-01-01T00:00:00.000Z' },
          { _id: 'my-event-id', _createdAt: '2024-01-01T00:00:01.000Z' },
        ]);

      (sanityClient.create as jest.Mock).mockResolvedValue(myEvent);
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: 'stripe-sess-id',
        url: 'https://checkout.stripe.com/pay/race',
      });

      const result = await createEvent({ data: baseEventData });

      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({ active: false, pendingPayment: true })
      );
      expect(result).toMatchObject({
        _id: 'my-event-id',
        requiresPayment: true,
        paymentUrl: 'https://checkout.stripe.com/pay/race',
      });
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it('throws when session is not found', async () => {
      (getSession as jest.Mock).mockResolvedValue(null);

      await expect(createEvent({ data: baseEventData })).rejects.toThrow('Session not found');
    });
  });

  describe('resumeOrCreateCheckout', () => {
    const occurrenceId = 'occ-123';

    beforeEach(() => {
      (getSession as jest.Mock).mockResolvedValue(mockSession);
    });

    it('returns existing checkout URL when Stripe session is still open', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValue({
        _id: occurrenceId,
        title: 'Test Event',
        stripeSessionId: 'existing-sess-id',
        pendingPayment: true,
        createdByUser: { _ref: 'user-123' },
      });
      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        status: 'open',
        url: 'https://checkout.stripe.com/pay/existing',
      });

      const result = await resumeOrCreateCheckout({ occurrenceId });

      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith('existing-sess-id');
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
      expect(result).toEqual({ paymentUrl: 'https://checkout.stripe.com/pay/existing' });
    });

    it('creates a new Stripe session when the existing one has expired', async () => {
      const { patchMock } = makePatchMock({});
      (sanityClient.patch as jest.Mock).mockImplementation(patchMock);

      (sanityClient.fetch as jest.Mock).mockResolvedValue({
        _id: occurrenceId,
        title: 'Test Event',
        stripeSessionId: 'expired-sess-id',
        pendingPayment: true,
        createdByUser: { _ref: 'user-123' },
      });
      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        status: 'expired',
        url: null,
      });
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: 'new-sess-id',
        url: 'https://checkout.stripe.com/pay/new',
      });

      const result = await resumeOrCreateCheckout({ occurrenceId });

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({ occurrenceId }),
        })
      );
      expect(result).toEqual({ paymentUrl: 'https://checkout.stripe.com/pay/new' });
    });

    it('creates a new Stripe session when occurrence has no prior session', async () => {
      const { patchMock } = makePatchMock({});
      (sanityClient.patch as jest.Mock).mockImplementation(patchMock);

      (sanityClient.fetch as jest.Mock).mockResolvedValue({
        _id: occurrenceId,
        title: 'Test Event',
        stripeSessionId: undefined,
        pendingPayment: true,
        createdByUser: { _ref: 'user-123' },
      });
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: 'brand-new-sess-id',
        url: 'https://checkout.stripe.com/pay/brand-new',
      });

      const result = await resumeOrCreateCheckout({ occurrenceId });

      expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
      expect(result).toEqual({ paymentUrl: 'https://checkout.stripe.com/pay/brand-new' });
    });

    it('throws when the occurrence belongs to a different user', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValue({
        _id: occurrenceId,
        title: 'Test Event',
        stripeSessionId: undefined,
        pendingPayment: true,
        createdByUser: { _ref: 'other-user-456' },
      });

      await expect(resumeOrCreateCheckout({ occurrenceId })).rejects.toThrow(
        'Not found or unauthorized'
      );
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    });

    it('throws when the occurrence does not exist', async () => {
      (sanityClient.fetch as jest.Mock).mockResolvedValue(null);

      await expect(resumeOrCreateCheckout({ occurrenceId })).rejects.toThrow(
        'Not found or unauthorized'
      );
    });
  });
});
