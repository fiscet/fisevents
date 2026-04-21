'use client';

import { useTransition } from 'react';
import { updateEventAttendantStatus } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import { useDictionary } from '@/app/contexts/DictionaryContext';
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
  const { creator_admin: ca } = useDictionary();
  const { attendants: d } = ca;

  const handleChange = (value: string) => {
    startTransition(async () => {
      try {
        await updateEventAttendantStatus({
          eventId,
          eventAttendantUuid: attendantUuid,
          data: { paymentStatus: value },
        });
        showNotification({ type: 'success', message: d.payment_updated });
      } catch (error) {
        showNotification({ type: 'error', message: d.payment_error });
      }
    });
  };

  return (
    <Select
      defaultValue={paymentStatus || 'pending'}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[150px] h-8 text-xs">
        <SelectValue placeholder={d.payment} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">{d.payment_pending}</SelectItem>
        <SelectItem value="paid">{d.payment_paid}</SelectItem>
        <SelectItem value="na">{d.payment_na}</SelectItem>
      </SelectContent>
    </Select>
  );
}
