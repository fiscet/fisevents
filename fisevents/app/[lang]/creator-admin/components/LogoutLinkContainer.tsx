'use client';

import { getDictionary } from '@/lib/i18n.utils';
import { signOut } from 'next-auth/react';
import LogoutLink from './LogoutLink';

export type LogoutLinkContainerProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['auth'];
};

export default function LogoutLinkContainer({
  dictionary
}: LogoutLinkContainerProps) {
  return <LogoutLink label={dictionary.logout} onSignOut={signOut} />;
}
