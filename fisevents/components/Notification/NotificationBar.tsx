import React, { ElementType } from 'react';
import { Notification } from '@/types/custom.types';
import {
  IoClose,
  IoWarning,
  IoAlert,
  IoInformation,
  IoCheckmark
} from 'react-icons/io5';
import { cn } from '@/lib/utils';

type NotificationStyleType = {
  [index in Notification['type']]: {
    mainClasses: string;
    Icon: ElementType;
    allowClose?: boolean;
  };
};

const notificationStyles: NotificationStyleType = {
  success: {
    mainClasses: 'bg-green-600 text-white',
    Icon: () => (
      <IoCheckmark className="h-6 w-6 bg-white text-green-600 rounded-full p-1" />
    ),
    allowClose: true
  },
  error: {
    mainClasses: 'bg-red-500 text-white',
    Icon: () => (
      <IoAlert className="h-6 w-6 bg-white text-red-500 rounded-full p-1" />
    ),
    allowClose: true
  },
  info: {
    mainClasses: 'bg-sky-500 text-white',
    Icon: () => (
      <IoInformation className="h-6 w-6 bg-white text-sky-500 rounded-full p-1" />
    ),
    allowClose: true
  },
  warning: {
    mainClasses: 'bg-yellow-200 text-gray-700',
    Icon: () => (
      <IoWarning className="h-6 w-6 bg-gray-700 text-yellow-200 rounded-full p-1" />
    ),
    allowClose: true
  },
  none: {
    mainClasses: 'invisible',
    Icon: () => <div className="h-6 w-6"></div>,
    allowClose: false
  }
};

export type NotificationBarProps = {
  title?: string;
  message: string;
  type: Notification['type'];
  className?: string;
  onClose: () => void;
};

export function NotificationBar({
  title,
  message,
  type,
  className,
  onClose
}: NotificationBarProps) {
  const { mainClasses, Icon, allowClose } = notificationStyles[type];

  return (
    <div
      className={cn('sticky top-4 md:top-8 z-50', className)}
      data-testid="notification-bar"
    >
      <div className={cn('py-2 px-4 rounded-md shadow-sm', mainClasses)}>
        <div className="flex items-center justify-between">
          <Icon />
          <div className="grow text-center">
            <div className="text-lg font-bold">{title || '&nbsp;'}</div>
            <div className="text-sm px-2">{message || '&nbsp;'}</div>
          </div>
          {allowClose && (
            <IoClose
              onClick={onClose}
              className="w-6 h-6 cursor-pointer transition-colors ease-in-out duration-500 hover:text-orange-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationBar;
