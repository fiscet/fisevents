'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/i18n.utils';
import { RiAccountCircleFill } from 'react-icons/ri';
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
              <RiAccountCircleFill
                className={`w-8 md:w-10 h-8 md:h-10 ${
                  href ? 'text-orange-600' : 'text-gray-600'
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
