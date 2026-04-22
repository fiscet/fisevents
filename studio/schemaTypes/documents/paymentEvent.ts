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
      description: 'Sanity _id of the event — use this to search in Events if still exists',
    },
    {
      title: 'Event Title',
      name: 'eventTitle',
      type: 'string',
      description: 'Snapshot of the event title at log time — survives deletion',
    },
    {
      title: 'Stripe Session ID',
      name: 'sessionId',
      type: 'string',
      description: 'Paste in Stripe dashboard → Payments → search to see full details',
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
      eventType: 'eventType',
      eventTitle: 'eventTitle',
      occurrenceId: 'occurrenceId',
      status: 'status',
      date: 'receivedAt',
    },
    prepare({ eventType, eventTitle, occurrenceId, status, date }: { eventType?: string; eventTitle?: string; occurrenceId?: string; status?: string; date?: string }) {
      const statusIcon = status === 'processed' ? '✅' : status === 'failed' ? '❌' : status === 'skipped' ? '⏭' : '⏳';
      return {
        title: `${statusIcon} ${eventTitle ?? occurrenceId ?? 'unknown event'}`,
        subtitle: `${eventType ?? ''} · ${date ? new Date(date).toLocaleString() : ''}`,
      };
    },
  },
};
