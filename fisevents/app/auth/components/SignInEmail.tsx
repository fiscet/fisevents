'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInEmail() {
  const [email, setEmail] = useState<string | null>(null);

  async function signInWithEmail() {
    const res = await signIn('email', {
      email,
      callbackUrl: window.location.origin,
      redirect: false
    });

    if (!res?.ok) {
      return toast({
        title: 'Wrong login',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }

    return toast({
      title: 'Check your email',
      description: 'A magic link has been sent to you'
    });
  }

  return (
    <form action={signInWithEmail}>
      <div className="flex flex-col gap-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" className="mt-4 w-full">
        Login with Email
      </Button>
    </form>
  );
}
