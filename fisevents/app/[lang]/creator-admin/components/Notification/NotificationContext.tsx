'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { Notification } from '@/types/custom.types';
import NotificationBar from './NotificationBar';

type NotificationContextType = {
  showNotification: ({ title, message, type }: Notification) => void;
  hideNotification: () => void;
};

const inintialState: Notification = {
  title: '',
  message: '',
  type: 'none'
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification>(inintialState);

  const showNotification = useCallback(
    ({ title, message, type }: Notification) => {
      setNotification({ title, message, type });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(inintialState);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {notification && (
        <NotificationBar
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
}
