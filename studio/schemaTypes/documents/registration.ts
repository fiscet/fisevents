import {defineField, defineType} from 'sanity'
import {GrUserFemale} from 'react-icons/gr'

export default defineType({
  title: 'Registrations',
  name: 'registration',
  type: 'document',
  icon: GrUserFemale,
  fields: [
    defineField({
      title: 'Event',
      name: 'occurrence',
      type: 'reference',
      to: [{type: 'occurrence'}],
      weak: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Full Name',
      name: 'fullName',
      type: 'string',
    }),
    defineField({
      title: 'Email',
      name: 'email',
      type: 'string',
    }),
    defineField({
      title: 'Phone',
      name: 'phone',
      type: 'string',
    }),
    defineField({
      title: 'Custom field values',
      name: 'customFieldValues',
      type: 'array',
      of: [{type: 'customFieldValue'}],
    }),
    defineField({
      title: 'Privacy accepted',
      name: 'privacyAccepted',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Subscription Date',
      name: 'subcribitionDate',
      type: 'datetime',
    }),
    defineField({
      name: 'uuid',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      title: 'Checked In',
      name: 'checkedIn',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      title: 'Payment Status',
      name: 'paymentStatus',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Paid', value: 'paid'},
          {title: 'Not Applicable', value: 'na'},
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      title: 'Status',
      name: 'status',
      type: 'string',
      description:
        'Confirmed: holds a counted spot. Waitlisted: queued behind a full event. Offered: a spot was freed and is held for this person until offerExpiresAt. Expired: the offer timed out without a response.',
      options: {
        list: [
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Waitlisted', value: 'waitlisted'},
          {title: 'Offered', value: 'offered'},
          {title: 'Expired', value: 'expired'},
        ],
      },
      initialValue: 'confirmed',
    }),
    defineField({
      title: 'Offer Expires At',
      name: 'offerExpiresAt',
      type: 'datetime',
      readOnly: true,
      description: 'Set when a waitlisted registration is offered a freed spot; cleared once accepted or expired.',
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      email: 'email',
      date: 'subcribitionDate',
      status: 'status',
    },
    prepare({title, email, date, status}) {
      const when = date ? new Date(date).toLocaleDateString() : ''
      const statusLabel = status && status !== 'confirmed' ? ` [${status}]` : ''
      return {
        title: (title || '(anonymized)') + statusLabel,
        subtitle: [email, when].filter(Boolean).join(' · '),
      }
    },
  },
})
