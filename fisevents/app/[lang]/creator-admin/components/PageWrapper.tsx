'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, Suspense, useEffect } from 'react';
import Loading from '../loading';
import GlobalChecks from './GlobalChecks';
import { getDictionary } from '@/lib/i18n.utils';

export type PageWrapperProps = {
  children: ReactNode;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['notifications'];
};

export default function PageWrapper({
  children,
  dictionary
}: PageWrapperProps) {
  return (
    <div className="py-2">
      <SessionProvider>
        <GlobalChecks dictionary={dictionary} />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </SessionProvider>
    </div>
  );
}
