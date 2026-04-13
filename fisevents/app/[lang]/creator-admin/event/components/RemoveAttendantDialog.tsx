'use client';

import { useTransition, useState } from 'react';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { removeEventAttendant } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
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

export type RemoveAttendantDialogProps = {
  eventId: string;
  attendantUuid: string;
  attendantName: string;
};

export default function RemoveAttendantDialog({
  eventId,
  attendantUuid,
  attendantName,
}: RemoveAttendantDialogProps) {
  const { creator_admin: ca } = useDictionary();
  const { attendants: d, shared: s } = ca;
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeEventAttendant({
          eventId,
          eventAttendantUuid: attendantUuid,
        });
        showNotification({
          type: 'success',
          message: s.success_text || 'Removed successfully',
        });
        setIsOpen(false);
      } catch (error: any) {
        showNotification({
          type: 'error',
          message: s.error_text || 'Error removing attendant',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {'Remove'} {attendantName}?
          </DialogTitle>
          <DialogDescription>
            {
              'Are you sure you want to remove this attendant? This action cannot be undone.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            {'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            {isPending ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
