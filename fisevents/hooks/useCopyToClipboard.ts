import { useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

export const useCopyToClipboard = () => {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (error) {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  return {
    copyState,
    copyToClipboard
  };
};
