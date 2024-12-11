'use client';

import { signIn } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import SignInWithEmail from './SignInWithEmail';
import SignInWithGoogle from './SignInWithGoogle';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export default function SignInProviders() {
  const {auth: d} = useDictionary();
  return (
    <div className="flex flex-col gap-y-2">
      <SignInWithEmail
        dictionary={d.login_with_email}
        onSignIn={signIn}
      />
      <Separator className="my-4" />
      <SignInWithGoogle
        dictionary={d.login_with_google}
        onSignIn={signIn}
      />
    </div>
  );
}
