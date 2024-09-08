'use client';

import { usePathname } from 'next/navigation';
import { CreatorAdminRoutes } from '@/lib/routes';
import AccountLink from './AccountLink';

export type AccountLinkContainerProps = {
  label: string;
  pictureUrl?: string;
};

export default function AccountLinkContainer({
  label,
  pictureUrl
}: AccountLinkContainerProps) {
  const pathname = usePathname();
  const linkTo = CreatorAdminRoutes.getItem('user-account');

  const href = pathname?.endsWith(linkTo) ? '' : `/${linkTo}`;

  return <AccountLink label={label} href={href} pictureUrl={pictureUrl} />;
}
