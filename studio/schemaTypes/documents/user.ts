import { PiUsers } from "react-icons/pi";

export default {
  title: 'Users',
  name: 'user',
  icon: PiUsers,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string'
    },
    {
      title: 'Image',
      name: 'image',
      type: 'url'
    },
    {
      // this is only if you use credentials provider
      name: 'password',
      type: 'string',
      hidden: true
    },
    {
      name: 'emailVerified',
      type: 'datetime',
      hidden: true,
    }
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email'
    },
    prepare(selection: { [key: string]: unknown; }) {
      const { name, email } = selection;

      const title = name ? name : email;
      const subtitle = name ? email : '';

      return {
        title: title,
        subtitle: subtitle
      };
    }
  }
};