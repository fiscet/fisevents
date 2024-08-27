'use client';

import { usePathname } from 'next/navigation';
import { CreatorAdminRoutes } from '@/lib/routes';
import AccountLink from './AccountLink';

export type AccountLinkContainerProps = {
  label: string;
};

export default function AccountLinkContainer({
  label
}: AccountLinkContainerProps) {
  const pathname = usePathname();
  const href = pathname?.endsWith('account')
    ? ''
    : `/${CreatorAdminRoutes.getBase()}/account`;

  return <AccountLink label={label} href={href} />;
}
