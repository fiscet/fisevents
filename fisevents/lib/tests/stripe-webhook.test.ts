import { POST } from '@/app/api/stripe/webhook/route';
import { sanityClient } from '@/lib/sanity.cli';
import { stripe } from '@/lib/stripe';
import { sendMail } from '@/lib/send-mail';
import { deleteOccurrenceCascade } from '@/lib/registrations';
import { revalidateTag } from 'next/cache';

jest.mock('@/lib/sanity.cli', () => {
  const client: Record<string, jest.Mock> = {
    fetch: jest.fn(),
    patch: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    withConfig: jest.fn(),
  };
  client.withConfig.mockReturnValue(client);
  const patchChain = {
    set: jest.fn().mockReturnThis(),
    commit: jest.fn().mockResolvedValue({}),
  };
  client.patch.mockReturnValue(patchChain);
  return { sanityClient: client };
});

jest.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

jest.mock('@/lib/send-mail', () => ({
  sendMail: jest.fn().mockResolvedValue({ messageId: 'test-mail-id' }),
}));

jest.mock('@/lib/registrations', () => ({
  deleteOccurrenceCascade: jest.fn().mockResolvedValue({}),
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: (name: string) => (name === 'stripe-signature' ? 'mock_signature' : null),
  }),
}));

describe('Stripe Webhook Route Handler (POST)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
    process.env.SITE_MAIL_RECEIVING = 'admin@fisevents.com';
  });

  it('should return 400 Bad Request if stripe-signature header is missing', async () => {
    const { headers } = require('next/headers');
    headers.mockResolvedValueOnce({
      get: () => null,
    });

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe('No signature');
  });

  it('should return 400 Bad Request if webhook signature verification fails', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid signature');
    });

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe('Webhook signature verification failed');
  });

  it('should process checkout.session.completed and update Sanity occurrence state', async () => {
    const mockEvent = {
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_abc',
          metadata: {
            occurrenceId: 'occ_123',
            eventTitle: 'Tech Conference 2026',
          },
          amount_total: 470,
          currency: 'eur',
        },
      },
    };

    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
    (sanityClient.fetch as jest.Mock)
      .mockResolvedValueOnce(null) // isAlreadyProcessed -> false
      .mockResolvedValueOnce({
        title: 'Tech Conference 2026',
        creatorEmail: 'creator@example.com',
        creatorName: 'John Doe',
      }); // eventForWebhookQuery

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Verify Sanity patch was called
    expect(sanityClient.patch).toHaveBeenCalledWith('occ_123');
    expect(revalidateTag).toHaveBeenCalledWith('eventList');
    expect(revalidateTag).toHaveBeenCalledWith('eventSingle:occ_123');

    // Verify email notification sent to admin and creator
    expect(sendMail).toHaveBeenCalledTimes(2);

    // Verify paymentEvent log creation
    expect(sanityClient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'paymentEvent',
        stripeEventId: 'evt_test_123',
        status: 'processed',
      })
    );
  });

  it('should skip duplicate events if already processed', async () => {
    const mockEvent = {
      id: 'evt_duplicate_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_abc',
          metadata: { occurrenceId: 'occ_123' },
        },
      },
    };

    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
    (sanityClient.fetch as jest.Mock).mockResolvedValueOnce('existing_payment_event_id'); // isAlreadyProcessed -> true

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Patch should NOT be called for duplicate event
    expect(sanityClient.patch).not.toHaveBeenCalled();
    expect(sanityClient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'skipped',
        errorMessage: 'Duplicate event',
      })
    );
  });

  it('should delete pending occurrence when checkout.session.expired triggers', async () => {
    const mockEvent = {
      id: 'evt_expired_123',
      type: 'checkout.session.expired',
      data: {
        object: {
          id: 'cs_test_expired',
          metadata: { occurrenceId: 'occ_pending_456' },
        },
      },
    };

    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
    (sanityClient.fetch as jest.Mock)
      .mockResolvedValueOnce(null) // isAlreadyProcessed -> false
      .mockResolvedValueOnce('occ_pending_456'); // stillPending -> true

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(deleteOccurrenceCascade).toHaveBeenCalledWith('occ_pending_456');
    expect(revalidateTag).toHaveBeenCalledWith('eventList');
  });
});
