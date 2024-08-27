'use client';

import { useNotification } from '@/components/Notification/useNotification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDictionary } from '@/lib/i18n.utils';
import { useState } from 'react';

export type SignInWithEmailProps = {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['auth']['login_with_email'];
  onSignIn: (
    provider: string,
    { email, callbackUrl, redirect }: any
  ) => Promise<any>;
};

export default function SignInWithEmail({
  dictionary,
  onSignIn
}: SignInWithEmailProps) {
  const [email, setEmail] = useState<string | null>(null);

  const { showNotification } = useNotification();

  async function signInWithEmail() {
    const res = await onSignIn('email', {
      email,
      callbackUrl: window.location.origin,
      redirect: false
    });

    setEmail(null);

    if (!res?.ok) {
      showNotification({
        title: dictionary.err_title,
        message: dictionary.err_text,
        type: 'error'
      });

      return;
    }

    showNotification({
      title: dictionary.ok_title,
      message: dictionary.ok_text,
      type: 'success'
    });
  }

  return (
    <form action={signInWithEmail}>
      <div className="flex flex-col gap-y-2">
        <Label>{dictionary.email}</Label>
        <Input
          type="email"
          name="email"
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" className="mt-4 w-full">
        {dictionary.title}
      </Button>
    </form>
  );
}
