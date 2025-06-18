// components/ui/NotificationBar.tsx
import React from 'react';
import { Notification } from '@/lib/types';

interface NotificationBarProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

/**
 * NotificationBar Component
 * 
 * Displays temporary notification messages at the top of the screen.
 * Supports success, error, and info message types with auto-dismiss.
 * 
 * @param notifications - Array of active notifications
 * @param removeNotification - Callback to dismiss a notification
 */
export function NotificationBar({
  notifications,
  removeNotification
}: NotificationBarProps) {
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-2 p-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            mx-auto max-w-sm backdrop-blur-lg rounded-lg p-4 shadow-lg 
            transform transition-all duration-500 animate-slide-down
            ${notification.type === 'success' ? 'bg-green-500/90 text-white' : ''}
            ${notification.type === 'error' ? 'bg-red-500/90 text-white' : ''}
            ${notification.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 hover:opacity-80 transition-opacity"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}