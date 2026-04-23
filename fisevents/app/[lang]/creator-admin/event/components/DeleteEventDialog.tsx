'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { deleteEvent } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { CreatorAdminRoutes } from '@/lib/routes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function DeleteEventDialog({ eventId }: { eventId: string }) {
  const { creator_admin: ca } = useDictionary();
  const { events: d, shared: s } = ca;
  const { showNotification } = useNotification();
  const router = useRouter();
  const lang = useCurrentLang();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteEvent({ id: eventId });
        setIsOpen(false);
        showNotification({ type: 'success', message: d.delete_event_success });
        router.push(`/${lang}/${CreatorAdminRoutes.getItem('event')}`);
        router.refresh();
      } catch {
        showNotification({ type: 'error', message: s.error_text });
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          {d.delete_event}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{d.delete_event}</DialogTitle>
          <DialogDescription>{d.delete_event_confirm}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            {s.back}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? d.deleting : d.delete_event}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
