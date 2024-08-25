'use client';

import Link from 'next/link';
import { BiSolidUserRectangle } from 'react-icons/bi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { CreatorAdminRoutes } from '@/lib/routes';

export type AccountLinkProps = {
  label: string;
  pathname?: string;
};

export default function AccountLink({ label, pathname }: AccountLinkProps) {
  const href = pathname?.endsWith('account')
    ? ''
    : `${window.location.origin}/${CreatorAdminRoutes.getBase()}/account`;

  return (
    <div className="flex">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href}>
              <BiSolidUserRectangle
                className={`w-6 md:w-8 h-6 md:h-8 transition-colors ease-in-out duration-500  ${
                  href
                    ? 'text-orange-600 hover:text-orange-500'
                    : 'text-gray-600'
                }`}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
