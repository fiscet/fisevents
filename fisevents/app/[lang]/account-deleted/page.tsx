'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AccountDeletedPage() {
  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-2xl font-bold mb-4">Account deleted</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Your account and all associated data have been permanently deleted.
        Thank you for having used FisEvents.
      </p>
      <Link
        href="/"
        className="inline-block bg-fe-primary text-white px-6 py-2 rounded-lg font-semibold"
      >
        Back to home
      </Link>
    </div>
  );
}
