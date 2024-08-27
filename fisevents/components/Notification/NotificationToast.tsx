// components/NotificationToast.tsx
import React from 'react';

export type NotificationToastProps = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
};

export function NotificationToast({
  message,
  type,
  onClose
}: NotificationToastProps) {
  const getStyles = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      default:
        return '';
    }
  };

  return (
    <div
      className={`notification-bar fixed bottom-5 left-5 p-4 rounded-lg shadow-lg ${getStyles(
        type
      )}`}
    >
      <div className="flex items-center">
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-200 text-black rounded-full px-2 py-1"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default NotificationToast;
