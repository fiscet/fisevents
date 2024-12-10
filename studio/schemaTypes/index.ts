import account from './documents/account';
import user from './documents/user';
import verificationToken from './documents/verificationToken';
import occurrence from './documents/occurrence';
import eventType from './documents/eventType';

import blockContent from './components/blockContent';
import eventAttendant from './components/eventAttendant';

export const schemaTypes = [
  account,
  user,
  verificationToken,
  occurrence,
  eventType,

  blockContent,
  eventAttendant,
];
