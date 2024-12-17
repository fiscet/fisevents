'use client';

import { signIn } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import SignInWithEmail from './SignInWithEmail';
import SignInWithGoogle from './SignInWithGoogle';

export default function SignInProviders() {
  return (
    <div className="flex flex-col gap-y-2">
      <SignInWithEmail
        onSignIn={signIn}
      />
      <Separator className="my-4" />
      <SignInWithGoogle
        onSignIn={signIn}
      />
    </div>
  );
}
