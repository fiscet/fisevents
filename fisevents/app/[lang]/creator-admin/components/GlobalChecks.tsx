'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getDictionary } from '@/lib/i18n.utils';
import { useNotification } from '@/components/Notification/useNotification';
import { CreatorAdminRoutes } from '@/lib/routes';
import { usePathname, useRouter } from 'next/navigation';
import { getUser } from '@/lib/actions';

export type GlobalChecksProps = {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['notifications'];
};

export default function GlobalChecks({ dictionary }: GlobalChecksProps) {
  const session = useSession();
  const { showNotification } = useNotification();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session.data?.user?.uid) return;

    const redirectTo = CreatorAdminRoutes.getItem('user-account');

    getUser({ userId: session.data?.user!.uid! })
      .then((res) => {
        if (!res.name) {
          showNotification({
            title: dictionary.action_required,
            message: dictionary.missing_user_name,
            type: 'error'
          });

          if (!pathname?.endsWith(redirectTo)) {
            router.push(`${redirectTo}?tab=user`);
          }

          return;
        }

        return res;
      })
      .then((data) => {
        if (!data?._id) return;
        if (!data.curOrganization?.companySlug) {
          showNotification({
            title: dictionary.action_required,
            message: dictionary.missing_company_data,
            type: 'error'
          });
          if (!pathname?.endsWith(redirectTo)) {
            router.push(`${redirectTo}?tab=organization`);
          }
        }
      });
  }, [pathname, router, session.data?.user]);

  return <></>;
}
