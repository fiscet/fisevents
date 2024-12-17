import { useState } from 'react';
import Link from 'next/link';
import { TbCopy } from 'react-icons/tb';
import { TbCopyCheck } from 'react-icons/tb';
import { TbCopyXFilled } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { RiInformation2Fill } from 'react-icons/ri';

type CopyState = 'idle' | 'copied' | 'error';

export type AddToSiteProps = {
  publicUrl: string;
  title?: string;
  description?: string;
  copyText?: string;
  copySuccessText?: string;
  copyErrorText?: string;
};

export default function AddToSite({
  publicUrl,
  title,
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
      <div className="w-full my-2 p-3 justify-self-start bg-gray-200 border-slate-200 overflow-x-scroll rounded-md">
        {description && (
          <Popover>
            <PopoverTrigger className="mr-2">
              <RiInformation2Fill className="w-5 h-5 text-gray-600" />
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white shadow-lg">
              <div className="p-4">
                <p className="text-gray-600 mt-2">{description}</p>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Link
          href={publicUrl}
          target="_blank"
          className="text-cyan-700 whitespace-nowrap"
        >
          {publicUrl}
        </Link>

        <div className="flex justify-between items-center gap-x-2 mt-2">
          {title && <div className="text-gray-900 text-sm">{title}</div>}
          <Button
            variant={copyState === 'copied' ? 'success' : 'secondary'}
            size="sm"
            onClick={() => {
              navigator.clipboard
                .writeText(publicUrl)
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
