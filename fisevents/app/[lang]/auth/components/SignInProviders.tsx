'use client';

import { signIn } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import SignInWithEmail from './SignInWithEmail';
import SignInWithGoogle from './SignInWithGoogle';
import { getDictionary } from '@/lib/i18n.utils';

export type SignInProvidersProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['auth'];
};

export default function SignInProviders({ dictionary }: SignInProvidersProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <SignInWithEmail
        dictionary={dictionary.login_with_email}
        onSignIn={signIn}
      />
      <Separator className="my-4" />
      <SignInWithGoogle
        dictionary={dictionary.login_with_google}
        onSignIn={signIn}
      />
    </div>
  );
}
