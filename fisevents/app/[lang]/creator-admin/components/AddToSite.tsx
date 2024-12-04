import { useState } from 'react';
import Link from 'next/link';
import { TbCopy } from 'react-icons/tb';
import { TbCopyCheck } from 'react-icons/tb';
import { TbCopyXFilled } from 'react-icons/tb';
import { Button } from '@/components/ui/button';

type CopyState = 'idle' | 'copied' | 'error';

export type AddToSiteProps = {
  publicLink: string;
  description?: string;
  copyText?: string;
  copySuccessText?: string;
  copyErrorText?: string;
};

export default function AddToSite({
  publicLink,
  description,
  copyText = 'Copy',
  copySuccessText = 'Copied!',
  copyErrorText = 'Error copy :-('
}: AddToSiteProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const Icon = getCopyIcon(copyState);

  const getMessageText = (copyState: CopyState) => {
    switch (copyState) {
      case 'idle':
        return copyText;
      case 'copied':
        return copySuccessText;
      case 'error':
        return copyErrorText;
      default:
        return '';
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center bg-">
      <div className="w-full my-2 p-3 justify-self-start bg-gray-200 border-slate-200 text-cyan-700 whitespace-nowrap overflow-x-scroll rounded-md">
        <Link href={publicLink} target="_blank">
          {publicLink}
        </Link>
        <div className="text-right mt-2">
          <Button
            variant={copyState === 'copied' ? 'success' : 'secondary'}
            size="sm"
            onClick={() => {
              navigator.clipboard
                .writeText(publicLink)
                .then(() => {
                  setCopyState('copied');
                  setTimeout(() => setCopyState('idle'), 2000);
                })
                .catch(() => {
                  setCopyState('error');
                  setTimeout(() => setCopyState('idle'), 2000);
                });
            }}
          >
            <Icon className="size-4 mr-2" /> {getMessageText(copyState)}
          </Button>
        </div>
      </div>
      {description && (
        <div className="text-gray-900 text-sm">{description}</div>
      )}
    </div>
  );
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case 'idle':
      return TbCopy;
    case 'copied':
      return TbCopyCheck;
    case 'error':
      return TbCopyXFilled;
  }
}
