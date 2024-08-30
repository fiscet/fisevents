'use client';

import { ElementType } from 'react';
import { MdOutlineUnpublished, MdPublishedWithChanges } from 'react-icons/md';

export type PublishableIconProps = React.HTMLAttributes<HTMLDivElement> & {
  publishedIcon?: ElementType;
  unPublishedIcon?: ElementType;
  isPublishable: boolean;
};

export default function PublishableIcon({
  publishedIcon: PubIcon = MdPublishedWithChanges,
  unPublishedIcon: UnpubIcon = MdOutlineUnpublished,
  isPublishable
}: PublishableIconProps) {
  if (isPublishable) {
    return <PubIcon className="w-5 h-5 text-teal-600" />;
  }

  return <UnpubIcon className="w-5 h-5 text-red-400" />;
}
