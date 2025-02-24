'use client';

import Link from 'next/link';
import { IoLogOutSharp } from 'react-icons/io5';
import PopoverSimple from '../PopoverSimple';

export type LogoutLinkProps = {
  label: string;
  onSignOut: ({ callbackUrl }: { callbackUrl: string }) => void;
};

export default function LogoutLink({ label, onSignOut }: LogoutLinkProps) {
  return (
    <PopoverSimple label={label}>
      <Link
        href=""
        onClick={() =>
          onSignOut({ callbackUrl: `${window.location.origin}/auth` })
        }
      >
        <IoLogOutSharp className="w-7 md:w-9 h-7 md:h-9 transition-colors ease-in-out duration-500 hover:text-orange-600" />
      </Link>
    </PopoverSimple>
  );
}
