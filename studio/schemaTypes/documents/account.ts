
import { SiGoogleauthenticator } from "react-icons/si";

export default {
  title: 'Accounts',
  name: 'account',
  icon: SiGoogleauthenticator,
  type: 'document',
  fields: [
    {
      name: 'providerType',
      type: 'string'
    },
    {
      name: 'providerId',
      type: 'string'
    },
    {
      name: 'providerAccountId',
      type: 'string'
    },
    {
      name: 'refreshToken',
      type: 'string'
    },
    {
      name: 'accessToken',
      type: 'string'
    },
    {
      name: 'accessTokenExpires',
      type: 'number'
    },
    {
      title: 'User',
      name: 'user',
      type: 'reference',
      to: { type: 'user' }
    }
  ]
};