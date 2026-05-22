import account from './documents/account';
import user from './documents/user';
import verificationToken from './documents/verificationToken';
import occurrence from './documents/occurrence';
import eventType from './documents/eventType';
import paymentEvent from './documents/paymentEvent';
import landingPage from './documents/landingPage';

import blockContent from './components/blockContent';
import eventAttendant from './components/eventAttendant';
import customFieldDef from './components/customFieldDef';
import customFieldValue from './components/customFieldValue';

export const schemaTypes = [
  account,
  user,
  verificationToken,
  occurrence,
  eventType,
  paymentEvent,
  landingPage,

  blockContent,
  eventAttendant,
  customFieldDef,
  customFieldValue,
];
