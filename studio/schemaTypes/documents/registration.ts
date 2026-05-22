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
  ],
  preview: {
    select: {
      title: 'fullName',
      email: 'email',
      date: 'subcribitionDate',
    },
    prepare({title, email, date}) {
      const when = date ? new Date(date).toLocaleDateString() : ''
      return {
        title: title || '(anonymized)',
        subtitle: [email, when].filter(Boolean).join(' · '),
      }
    },
  },
})
