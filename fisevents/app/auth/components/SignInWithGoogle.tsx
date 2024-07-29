'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import GoogleLogo from './GoogleLogo';

export default function SignInWithGoogle() {
  return (
    <Button
      onClick={async () =>
        await signIn('google', {
          callbackUrl: `${window.location.origin}`
        })
      }
      variant="secondary"
    >
      <span className="mr-2">
        <GoogleLogo />
      </span>
      Login with Google
    </Button>
  );
}
