'use client';

import { getDictionary } from '@/lib/i18n.utils';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { IoLogOutSharp } from 'react-icons/io5';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function LogoutLink({
  dictionary
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['auth'];
}) {
  return (
    <div className="flex">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href=""
              onClick={() =>
                signOut({ callbackUrl: `${window.location.origin}/auth` })
              }
            >
              <IoLogOutSharp className="w-7 md:w-9 h-7 md:h-9 transition-colors ease-in-out duration-500 hover:text-orange-500" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{dictionary.logout}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
