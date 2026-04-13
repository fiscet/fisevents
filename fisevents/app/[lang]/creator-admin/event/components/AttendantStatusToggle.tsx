'use client';

import { useTransition } from 'react';
import { updateEventAttendantStatus } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import { Checkbox } from '@/components/ui/checkbox';

export type AttendantStatusToggleProps = {
  eventId: string;
  attendantUuid: string;
  checkedIn?: boolean;
};

export default function AttendantStatusToggle({
  eventId,
  attendantUuid,
  checkedIn = false,
}: AttendantStatusToggleProps) {
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      try {
        await updateEventAttendantStatus({
          eventId,
          eventAttendantUuid: attendantUuid,
          data: { checkedIn: checked },
        });
        showNotification({ type: 'success', message: 'Status updated' });
      } catch (error) {
        showNotification({ type: 'error', message: 'Failed to update status' });
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`checkin-${attendantUuid}`}
        checked={checkedIn}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <label
        htmlFor={`checkin-${attendantUuid}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Checked In
      </label>
    </div>
  );
}
