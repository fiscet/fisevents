'use client';

import { useState } from 'react';
import { useNotification } from '@/components/Notification/useNotification';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Notification } from '@/types/custom.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Processing from '@/components/Processing';
import FormFieldHeader from '@/components/FormField/FormFieldHeader';
import { WebsiteRoutes } from '@/lib/routes';

export type SignInWithEmailProps = {
  onSignIn: (
    provider: string,
    { email, callbackUrl, redirect }: any
  ) => Promise<any>;
};

export default function SignInWithEmail({ onSignIn }: SignInWithEmailProps) {
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
        message: d.validation.email,
        type: 'error'
      };

      showNotification(notificationParams);

      return;
    }

    const url = `${window.location.origin}/${WebsiteRoutes.getItem(
      'waiting_for_the_email'
    )}`;

    const res = await onSignIn('email', {
      email,
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

    window.location.href = url;
  }

  return (
    <>
      {isLoading && <Processing />}
      <form action={handleSubmit}>
        <div className="flex flex-col gap-y-2">
          <FormFieldHeader
            label={d.email}
            description={d.descriptions.email}
            inForm={false}
          />
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
