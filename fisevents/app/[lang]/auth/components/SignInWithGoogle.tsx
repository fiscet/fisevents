'use client';

import { Button } from '@/components/ui/button';
import GoogleLogo from './GoogleLogo';
import { CreatorAdminRoutes } from '@/lib/routes';
import { getDictionary } from '@/lib/i18n.utils';

export type SignInWithGoogleProps = {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['auth']['login_with_google'];
  onSignIn: (
    provider: string,
    { email, callbackUrl, redirect }: any
  ) => Promise<any>;
};

export default function SignInWithGoogle({
  dictionary,
  onSignIn
}: SignInWithGoogleProps) {
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
      {dictionary.title}
    </Button>
  );
}
