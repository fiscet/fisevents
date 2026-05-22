import { useState, useTransition } from 'react';

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
