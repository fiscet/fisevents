'use client';

import Link from 'next/link';
import { BiSolidUserRectangle } from 'react-icons/bi';
import TooltipSimple from '../TooltipSimple';

export type AccountLinkProps = {
  label: string;
  href: string;
};

export default function AccountLink({ label, href }: AccountLinkProps) {
  return (
    <TooltipSimple label={label}>
      <Link href={href}>
        <BiSolidUserRectangle
          className={`w-6 md:w-8 h-6 md:h-8 transition-colors ease-in-out duration-500  ${
            href ? 'text-orange-600 hover:text-orange-500' : 'text-gray-600'
          }`}
        />
      </Link>
    </TooltipSimple>
  );
}
