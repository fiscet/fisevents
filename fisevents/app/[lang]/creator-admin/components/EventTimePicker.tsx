import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { useState } from 'react';

export type EventTimePickerProps = {
  value?: string;
};

export default function EventTimePicker({ value }: EventTimePickerProps) {
  const [time, setTime] = useState(value ?? '1030');

  return <div>ora</div>;
}
