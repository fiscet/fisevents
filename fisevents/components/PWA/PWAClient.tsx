'use client';

import dynamic from 'next/dynamic';

const InstallPrompt = dynamic(() => import('./InstallPrompt'), { ssr: false });
const UpdatePrompt = dynamic(() => import('./UpdatePrompt'), { ssr: false });

export default function PWAClient() {
  return (
    <>
      <InstallPrompt />
      <UpdatePrompt />
    </>
  );
}
