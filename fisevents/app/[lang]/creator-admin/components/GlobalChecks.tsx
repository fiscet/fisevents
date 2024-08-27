'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotification } from './Notification/useNotification';
import { getDictionary } from '@/lib/i18n.utils';

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
      showNotification({
        title: dictionary.action_required,
        message: dictionary.missing_user_name,
        type: 'error'
      });
    }
  }, [dictionary, session, showNotification]);

  return <></>;
}
