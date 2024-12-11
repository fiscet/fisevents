'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import Loading from '../loading';
import GlobalChecks from './GlobalChecks';

export type PageWrapperProps = {
  children: ReactNode;
};

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="py-2">
      <SessionProvider>
        <GlobalChecks />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </SessionProvider>
    </div>
  );
}
