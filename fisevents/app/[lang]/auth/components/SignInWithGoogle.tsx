'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import GoogleLogo from './GoogleLogo';
import { getDictionary } from '@/lib/i18n.utils';
import { CreatorAdminRoutes } from '@/lib/routes';

export default function SignInWithGoogle({
  dictionary
}: {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['auth']['login_with_google'];
}) {
  return (
    <Button
      onClick={async () =>
        await signIn('google', {
          callbackUrl: `${window.location.origin}/${CreatorAdminRoutes}/`
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
