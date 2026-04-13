'use client';

import { signIn } from 'next-auth/react';
import SignInWithEmail from './SignInWithEmail';

export default function SignInProviders() {
  return (
    <div className="flex flex-col gap-y-2">
      <SignInWithEmail onSignIn={signIn} />
    </div>
  );
}
