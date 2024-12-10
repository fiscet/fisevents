import { PiUsers } from "react-icons/pi";
import { defineField, defineType } from "sanity";

export default defineType({
  title: 'Users',
  name: 'user',
  icon: PiUsers,
  type: 'document',
  fields: [
    defineField({
      title: 'Name',
      name: 'name',
      type: 'string'
    }),
    defineField({
      title: 'Email',
      name: 'email',
      type: 'string'
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'url'
    }),
    defineField({
      // this is only if you use credentials provider
      name: 'password',
      type: 'string',
      hidden: true
    }),
    defineField({
      name: 'emailVerified',
      type: 'datetime',
      hidden: true,
    }),
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
      title: 'Company logo',
      name: 'logo',
      type: 'image'
    }),
    defineField({
      title: 'Website',
      name: 'www',
      type: 'url'
    }),
    defineField({
      title: 'Roles',
      name: 'roles',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'admin', title: 'Admin' },
          { value: 'editor', title: 'Editor' },
          { value: 'user', title: 'User' }
        ],
        layout: 'list'
      },
      initialValue: ['admin']
    })],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      companyName: 'companyName'
    },
    prepare({ name, email, companyName }) {
      const organization = companyName ? ` - ${companyName}` : '';
      const title = (name ? name : email) + organization;
      const subtitle = name ? email : '';

      return {
        title,
        subtitle
      };
    }
  }
});