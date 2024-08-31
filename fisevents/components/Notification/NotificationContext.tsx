'use client';

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect
} from 'react';
import type { Notification } from '@/types/custom.types';
import NotificationBar from './NotificationBar';

type NotificationContextType = {
  showNotification: ({ title, message, type }: Notification) => void;
  hideNotification: () => void;
};

const initialState: Notification = {
  title: '',
  message: '',
  type: 'none'
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function NotificationProvider({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const [notification, setNotification] = useState<Notification>(initialState);

  const showNotification = useCallback(
    ({ title, message, type }: Notification) => {
      setNotification({ title, message, type });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(initialState);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (notification.type !== 'none') {
      timeout = setTimeout(() => {
        hideNotification();
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [hideNotification, notification]);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {notification && (
        <NotificationBar
          title={notification.title}
          message={notification.message}
          type={notification.type}
          className={className}
          onClose={hideNotification}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
}
