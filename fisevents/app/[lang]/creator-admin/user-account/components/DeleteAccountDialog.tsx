'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { requestAccountDeletion } from '@/lib/actions';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const lang = useCurrentLang();

  const handleConfirm = () => {
    startTransition(async () => {
      await requestAccountDeletion({ lang });
      setEmailSent(true);
      setOpen(false);
    });
  };

  if (emailSent) {
    return (
      <p className="text-sm text-muted-foreground">
        Check your email — a confirmation link has been sent.
      </p>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete my account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription className="pt-2">
            This will permanently delete your account, all your events and all
            registrations. This action cannot be undone.
            <br /><br />
            A confirmation email will be sent to your address. Your account will
            only be deleted after you click the link in that email.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Sending…' : 'Send confirmation email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
