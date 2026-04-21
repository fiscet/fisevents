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
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

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
  const { copyState, copyToClipboard } = useCopyToClipboard();

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
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fe-surface-container-high border border-fe-outline-variant/20 max-w-[600px] w-full">
      <Link
        href={publicUrl}
        target="_blank"
        className="text-fe-secondary text-sm truncate flex-1 min-w-0"
      >
        {publicUrl}
      </Link>
      {description && (
        <Popover>
          <PopoverTrigger className="shrink-0">
            <RiInformation2Fill className="w-4 h-4 text-fe-on-surface-variant" />
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white shadow-lg">
            <div className="p-4">
              <p className="text-fe-on-surface-variant mt-2 text-sm">{description}</p>
            </div>
          </PopoverContent>
        </Popover>
      )}
      <Button
        variant={copyState === 'copied' ? 'success' : 'secondary'}
        size="sm"
        className="shrink-0"
        onClick={() => copyToClipboard(publicUrl)}
      >
        <Icon className="size-4 mr-1.5" /> {getMessageText(copyState)}
      </Button>
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
