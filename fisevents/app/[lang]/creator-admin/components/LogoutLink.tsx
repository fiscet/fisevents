'use client';

import { getDictionary } from '@/lib/i18n.utils';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ImExit } from 'react-icons/im';
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
              <ImExit className="w-6 md:w-8 h-6 md:h-8" />
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
