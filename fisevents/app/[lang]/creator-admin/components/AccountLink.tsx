'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/i18n.utils';
import { BiSolidUserRectangle } from 'react-icons/bi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function AccountLink({
  dictionary
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['auth'];
}) {
  const pathname = usePathname();
  const href = pathname.endsWith('account') ? '' : `${pathname}/account`;

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
            <p>{dictionary.account}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
