import account from './documents/account';
import user from './documents/user';
import verificationToken from './documents/verificationToken';
import occurrence from './documents/occurrence';
import eventType from './documents/eventType';
import eventAttendant from './components/eventAttendant';

import blockContent from './components/blockContent';

export const schemaTypes = [
  account,
  user,
  verificationToken,
  occurrence,
  eventType,

  blockContent,
  eventAttendant,
];
