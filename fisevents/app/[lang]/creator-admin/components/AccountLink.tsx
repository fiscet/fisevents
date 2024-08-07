'use client';

import Link from 'next/link';
import { RiAccountCircleFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';

export default function AccountLink() {
  const pathname = usePathname();
  const href = pathname.endsWith('account') ? '' : `${pathname}/account`;

  return (
    <Link href={href}>
      <RiAccountCircleFill
        className={`w-10 h-10 ${href ? 'text-orange-600' : 'text-gray-600'}`}
      />
    </Link>
  );
}
