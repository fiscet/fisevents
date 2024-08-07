import account from './documents/account';
import user from './documents/user';
import verificationToken from './documents/verificationToken';
import event from './documents/event';
import eventType from './documents/eventType';
import eventAttendant from './documents/eventAttendant';

import blockContent from './components/blockContent';

export const schemaTypes = [
  account,
  user,
  verificationToken,
  event,
  eventType,
  eventAttendant,

  blockContent
];
