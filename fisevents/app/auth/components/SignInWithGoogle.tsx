'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function SignInWithGoogle() {
  return (
    <Button onClick={async () => await signIn('google', {
      callbackUrl: `${window.location.origin}`
    })} className='mt-4' variant='secondary'>
      Login with Google
    </Button>
  );
}
