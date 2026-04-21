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
    <div className="w-full max-w-[650px] p-3 relative bg-fe-surface-container-high border-slate-200 rounded-md">
      <div className="py-3 overflow-x-auto">
        {description && (
          <Popover>
            <PopoverTrigger className="absolute top-2 right-2">
              <RiInformation2Fill className="w-5 h-5 text-fe-on-surface-variant" />
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white shadow-lg">
              <div className="p-4">
                <p className="text-fe-on-surface-variant mt-2">{description}</p>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <div className="mt-1">
          <Link
            href={publicUrl}
            target="_blank"
            className="text-fe-secondary whitespace-nowrap"
          >
            {publicUrl}
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-2 mt-2">
        {title && <div className="text-fe-on-surface text-sm">{title}</div>}
        <Button
          variant={copyState === 'copied' ? 'success' : 'secondary'}
          size="sm"
          onClick={() => copyToClipboard(publicUrl)}
        >
          <Icon className="size-4 mr-2" /> {getMessageText(copyState)}
        </Button>
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
