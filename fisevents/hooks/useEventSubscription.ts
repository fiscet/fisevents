import { useState, useTransition } from 'react';
import { EventAttendant } from '@/types/sanity.types';

export const useEventSubscription = () => {
  const [isSaving, startProcessing] = useTransition();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const resetSubscription = () => {
    setIsSubscribed(false);
  };

  return {
    isSaving,
    startProcessing,
    isSubscribed,
    setIsSubscribed,
    resetSubscription
  };
};
