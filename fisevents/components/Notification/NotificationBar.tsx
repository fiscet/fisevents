import React, { ElementType } from 'react';
import { Notification } from '@/types/custom.types';
import {
  IoClose,
  IoWarning,
  IoAlert,
  IoInformation,
  IoCheckmark,
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
    mainClasses: 'bg-fe-secondary text-fe-on-secondary',
    Icon: () => (
      <IoCheckmark className="h-6 w-6 bg-fe-on-secondary text-fe-secondary rounded-full p-1" />
    ),
    allowClose: true,
  },
  error: {
    mainClasses: 'bg-fe-error text-fe-on-error',
    Icon: () => (
      <IoAlert className="h-6 w-6 bg-fe-on-error text-fe-error rounded-full p-1" />
    ),
    allowClose: true,
  },
  info: {
    mainClasses: 'bg-fe-tertiary-container text-fe-on-tertiary-container',
    Icon: () => (
      <IoInformation className="h-6 w-6 bg-fe-on-tertiary text-fe-tertiary rounded-full p-1" />
    ),
    allowClose: true,
  },
  warning: {
    mainClasses: 'bg-fe-primary-fixed text-fe-on-primary-container',
    Icon: () => (
      <IoWarning className="h-6 w-6 text-fe-primary rounded-full p-1" />
    ),
    allowClose: true,
  },
  none: {
    mainClasses: 'invisible',
    Icon: () => <div className="h-6 w-6" />,
    allowClose: false,
  },
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
  onClose,
}: NotificationBarProps) {
  const { mainClasses, Icon, allowClose } = notificationStyles[type];

  return (
    <div
      className={cn('sticky top-4 md:top-8 mt-2 z-50', className)}
      data-testid="notification-bar"
      role="alert"
      aria-live="polite"
    >
      <div
        className={cn('py-3 px-5 rounded-xl shadow-editorial-sm', mainClasses)}
      >
        <div className="flex items-center justify-between gap-4">
          <Icon />
          <div className="flex-grow text-center">
            {title && (
              <div className="text-base font-headline font-bold">{title}</div>
            )}
            <div className="text-sm">{message}</div>
          </div>
          {allowClose && (
            <IoClose
              onClick={onClose}
              className="w-5 h-5 cursor-pointer transition-opacity hover:opacity-70 shrink-0"
              aria-label="Close notification"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationBar;
