import { ReactNode } from 'react';
import { IconType } from 'react-icons/lib';

export default function IconText({
  Icon,
  children
}: {
  Icon: IconType;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-2 items-center pl-2">
      <Icon className="w-5 h-5 text-blue-700" />
      {children}
    </div>
  );
}
