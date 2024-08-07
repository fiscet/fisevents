import { defineField, defineType } from 'sanity';
import { GrDirections } from "react-icons/gr";

export default defineType({
  title: 'Event Type',
  name: 'eventType',
  type: 'document',
  icon: GrDirections,
  fields: [
    defineField({
      title: 'Event code',
      name: 'code',
      type: 'string',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'blockContent',
    }),
    defineField({
      title: 'Active',
      name: 'active',
      type: 'boolean',
      description: 'If this will be visible in your websiste',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'code',
    }
  }
});
