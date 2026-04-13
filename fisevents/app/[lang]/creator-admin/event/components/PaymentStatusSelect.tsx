'use client';

import { useTransition } from 'react';
import { updateEventAttendantStatus } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type PaymentStatusSelectProps = {
  eventId: string;
  attendantUuid: string;
  paymentStatus?: string;
};

export default function PaymentStatusSelect({
  eventId,
  attendantUuid,
  paymentStatus = 'pending',
}: PaymentStatusSelectProps) {
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(async () => {
      try {
        await updateEventAttendantStatus({
          eventId,
          eventAttendantUuid: attendantUuid,
          data: { paymentStatus: value },
        });
        showNotification({
          type: 'success',
          message: 'Payment status updated',
        });
      } catch (error) {
        showNotification({
          type: 'error',
          message: 'Failed to update payment status',
        });
      }
    });
  };

  return (
    <Select
      defaultValue={paymentStatus || 'pending'}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[130px] h-8 text-xs">
        <SelectValue placeholder="Payment status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="na">Not Applicable</SelectItem>
      </SelectContent>
    </Select>
  );
}
