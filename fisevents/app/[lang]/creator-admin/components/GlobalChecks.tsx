'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getDictionary } from '@/lib/i18n.utils';
import { useNotification } from '@/components/Notification/useNotification';
import { CreatorAdminRoutes } from '@/lib/routes';

export type GlobalChecksProps = {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['notifications'];
};

export default function GlobalChecks({ dictionary }: GlobalChecksProps) {
  const session = useSession();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (session.status === 'authenticated' && !session.data?.user?.name) {
      const redirectTo = CreatorAdminRoutes.getItem('user-account');

      showNotification({
        title: dictionary.action_required,
        message: dictionary.missing_user_name,
        type: 'error'
      });

      window.location.href = redirectTo;
    }
  }, [dictionary, session, showNotification]);

  return <></>;
}
