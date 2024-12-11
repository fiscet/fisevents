'use client';

import { useNotification } from '@/components/Notification/useNotification';
import { Notification } from '@/types/custom.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Processing from '@/components/Processing';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type SignInWithEmailProps = {
  onSignIn: (
    provider: string,
    { email, callbackUrl, redirect }: any
  ) => Promise<any>;
};

export default function SignInWithEmail({
  onSignIn
}: SignInWithEmailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const { auth: da } = useDictionary();
  const { login_with_email: d } = da;
  const { showNotification } = useNotification();

  function handleSubmit() {
    showNotification({
      title: '',
      message: '',
      type: 'none'
    });
    setIsLoading(true);
    signInWithEmail();
  }

  async function signInWithEmail() {
    let notificationParams = {
      title: d.ok_title,
      message: d.ok_text,
      type: 'success'
    } as Notification;

    if (!email) {
      setIsLoading(false);

      notificationParams = {
        title: d.err_title,
        message: d.empty_email_text,
        type: 'error'
      };

      showNotification(notificationParams);

      return;
    }

    const res = await onSignIn('email', {
      email,
      callbackUrl: window.location.origin,
      redirect: false
    });

    setEmail(null);

    if (!res?.ok) {
      notificationParams = {
        title: d.err_title,
        message: d.err_text,
        type: 'error'
      };
    }

    showNotification(notificationParams);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <Processing />}
      <form action={handleSubmit}>
        <div className="flex flex-col gap-y-2">
          <Label>{d.email}</Label>
          <Input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="mt-4 w-full">
          {d.title}
        </Button>
      </form>
    </>
  );
}
