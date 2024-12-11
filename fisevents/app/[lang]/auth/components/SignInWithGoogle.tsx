'use client';

import { Button } from '@/components/ui/button';
import GoogleLogo from './GoogleLogo';
import { CreatorAdminRoutes } from '@/lib/routes';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type SignInWithGoogleProps = {
  onSignIn: (
    provider: string,
    { email, callbackUrl, redirect }: any
  ) => Promise<any>;
};

export default function SignInWithGoogle({
  onSignIn
}: SignInWithGoogleProps) {
  const { auth: da } = useDictionary();
  const { login_with_google: d } = da;

  return (
    <Button
      onClick={async () =>
        await onSignIn('google', {
          callbackUrl: `${
            window.location.origin
          }/${CreatorAdminRoutes.getBase()}/`
        })
      }
      variant="secondary"
    >
      <span className="mr-2">
        <GoogleLogo />
      </span>
      {d.title}
    </Button>
  );
}
