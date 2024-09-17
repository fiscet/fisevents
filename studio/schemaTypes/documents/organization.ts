import { defineField, defineType } from 'sanity';
import { GrOrganization } from "react-icons/gr";

export default defineType({
  title: 'Organizations',
  name: 'organization',
  icon: GrOrganization,
  type: 'document',
  fields: [
    defineField({
      title: 'Company name',
      name: 'companyName',
      type: 'string'
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'companyName',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Website',
      name: 'www',
      type: 'url'
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'image'
    })
  ],
  preview: {
    select: {
      title: 'companyName',
      media: 'image'
    }
  }
});