import { defineField, defineType } from 'sanity';
import { BsCalendar2Event } from "react-icons/bs";

export default defineType({
  title: 'Events',
  name: 'occurrence',
  type: 'document',
  icon: BsCalendar2Event,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Public slug',
      name: 'publicSlug',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Event image',
      name: 'mainImage',
      type: 'image'
    }),
    // defineField({
    //   title: 'Event Type',
    //   name: 'eventType',
    //   type: 'reference',
    //   to: { type: 'eventType' },
    //   validation: (rule) => rule.required(),
    // }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Location',
      name: 'location',
      type: 'text',
    }),
    defineField({
      title: 'Event contact person',
      name: 'talkTo',
      type: 'text',
    }),
    defineField({
      title: 'Max Subscribers',
      name: 'maxSubscribers',
      type: 'number',
      validation: (rule) => rule.precision(2)
    }),
    defineField({
      title: 'Basic Price',
      name: 'basicPrice',
      type: 'number',
      validation: (rule) => rule.precision(2)
    }),
    defineField({
      title: 'Currency',
      name: 'currency',
      type: 'string',
      validation: (rule) => rule.max(3)
    }),
    defineField({
      title: 'Start Date',
      name: 'startDate',
      type: 'datetime',
    }),
    defineField({
      title: 'End Date',
      name: 'endDate',
      type: 'datetime',
      validation: (rule) => rule.custom((endDate, context) => {
        const startDate = context.document?.startDate;
        if (startDate && endDate && new Date(endDate as string) <= new Date(startDate as string)) {
          return 'End date must be after start date';
        }
        return true;
      }),
    }),
    defineField({
      title: 'Publication Start Date',
      name: 'publicationStartDate',
      type: 'datetime',
      validation: (rule) => rule.custom((publicationStartDate, context) => {
        const startDate = context.document?.startDate;
        if (startDate && publicationStartDate && new Date(publicationStartDate as string) >= new Date(startDate as string)) {
          return 'Publication date must be before event start date';
        }
        return true;
      }),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'If this will be visible in your websiste',
      initialValue: true,
    }),
    defineField({
      title: 'Attendants',
      name: 'attendants',
      type: 'array',
      of: [
        {
          type: 'eventAttendant'
        }
      ]
    }),
    defineField({
      title: 'Created by',
      name: 'createdByUser',
      type: 'reference',
      to: { type: 'user' },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      mainImage: 'mainImage'
    },
    prepare({ title, startDate, mainImage }) {
      return {
        title: title,
        subtitle: new Date(startDate).toLocaleString(),
        media: mainImage
      };
    }
  }
});
