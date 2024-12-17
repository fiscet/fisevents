'use client';

import { signOut } from 'next-auth/react';
import LogoutLink from './LogoutLink';

export type LogoutLinkContainerProps = {
  label: string;
};

export default function LogoutLinkContainer({
  label
}: LogoutLinkContainerProps) {
  return <LogoutLink label={label} onSignOut={signOut} />;
}
