'use client';

import { usePathname } from 'next/navigation';
import { CreatorAdminRoutes } from '@/lib/routes';
import AccountLink from './AccountLink';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export type AccountLinkContainerProps = {
  label: string;
  pictureUrl?: string;
};

export default function AccountLinkContainer({
  label,
  pictureUrl
}: AccountLinkContainerProps) {
  const pathname = usePathname();
  const curLang = useCurrentLang();
  const linkTo = CreatorAdminRoutes.getItem('user-account');

  const href = pathname?.endsWith(linkTo) ? '' : `/${curLang}/${linkTo}`;

  return <AccountLink label={label} href={href} pictureUrl={pictureUrl} />;
}
