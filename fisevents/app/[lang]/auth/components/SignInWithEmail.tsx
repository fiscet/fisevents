'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { getDictionary } from '@/lib/i18n.utils';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInEmail({
  dictionary
}: {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['auth']['login_with_email'];
}) {
  const [email, setEmail] = useState<string | null>(null);

  async function signInWithEmail() {
    const res = await signIn('email', {
      email,
      callbackUrl: window.location.origin,
      redirect: false
    });

    setEmail(null);

    if (!res?.ok) {
      return toast({
        title: dictionary.toast_err_title,
        description: dictionary.toast_err_text,
        variant: 'destructive'
      });
    }

    return toast({
      title: dictionary.toast_ok_title,
      description: dictionary.toast_ok_text
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
