import { FaCreditCard } from 'react-icons/fa';

export default {
  title: 'Payment Events',
  name: 'paymentEvent',
  icon: FaCreditCard,
  type: 'document',
  readOnly: true,
  fields: [
    {
      title: 'Stripe Event ID',
      name: 'stripeEventId',
      type: 'string',
      description: 'Unique identifier from Stripe - used for idempotency',
    },
    {
      title: 'Event Type',
      name: 'eventType',
      type: 'string',
      description: 'e.g. checkout.session.completed, checkout.session.expired',
    },
    {
      title: 'Occurrence ID',
      name: 'occurrenceId',
      type: 'string',
    },
    {
      title: 'Stripe Session ID',
      name: 'sessionId',
      type: 'string',
    },
    {
      title: 'Status',
      name: 'status',
      type: 'string',
      options: {
        list: ['received', 'processed', 'failed', 'skipped'],
      },
    },
    {
      title: 'Error Message',
      name: 'errorMessage',
      type: 'text',
    },
    {
      title: 'Amount (cents)',
      name: 'amount',
      type: 'number',
    },
    {
      title: 'Currency',
      name: 'currency',
      type: 'string',
    },
    {
      title: 'Received At',
      name: 'receivedAt',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'eventType',
      subtitle: 'status',
      date: 'receivedAt',
    },
    prepare({ title, subtitle, date }: { title?: string; subtitle?: string; date?: string }) {
      return {
        title: title ?? 'unknown',
        subtitle: `${subtitle ?? ''} · ${date ? new Date(date).toLocaleString() : ''}`,
      };
    },
  },
};
