import { SiAmazonsimpleemailservice } from "react-icons/si";

export default {
  title: 'Verification Tokens',
  name: 'verificationToken',
  icon: SiAmazonsimpleemailservice,
  type: 'document',
  fields: [
    {
      title: 'Identifier',
      name: 'identifier',
      type: 'string'
    },
    {
      title: 'Token',
      name: 'token',
      type: 'string'
    },
    {
      title: 'Expires',
      name: 'expires',
      type: 'datetime'
    }
  ]
};