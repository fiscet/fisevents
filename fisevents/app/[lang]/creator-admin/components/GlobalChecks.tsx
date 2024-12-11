'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotification } from '@/components/Notification/useNotification';
import { CreatorAdminRoutes } from '@/lib/routes';
import { usePathname, useRouter } from 'next/navigation';
import { getUser } from '@/lib/actions';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export default function GlobalChecks() {
  const session = useSession();
  const { showNotification } = useNotification();
  const { creator_admin } = useDictionary();
  const d = creator_admin.notifications;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session.data?.user?.uid) return;

    const redirectTo = CreatorAdminRoutes.getItem('user-account');

    getUser({ userId: session.data?.user!.uid! }).then((res) => {
      if (!res.name) {
        showNotification({
          title: d.action_required,
          message: d.missing_user_name,
          type: 'info'
        });

        if (!pathname?.endsWith(redirectTo)) {
          router.push(redirectTo);
        }

        return;
      }
      if (!res.companyName) {
        showNotification({
          title: d.action_required,
          message: d.missing_company_data,
          type: 'info'
        });

        if (!pathname?.endsWith(redirectTo)) {
          router.push(redirectTo);
        }

        return;
      }

      return res;
    });
  }, [pathname, router, session.data?.user]);

  return <></>;
}
