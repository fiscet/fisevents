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
      name: 'organization',
      type: 'reference',
      to: { type: 'organization' }
    })
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      companyName: 'organization.companyName',
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