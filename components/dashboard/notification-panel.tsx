'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  incidentId?: string;
  isRead: boolean;
  createdAt: string | Date;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
}

export default function NotificationPanel({ 
  notifications, 
  onMarkAsRead,
  onClearAll 
}: NotificationPanelProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'incident-assigned': return '👤';
      case 'status-updated': return '🔄';
      case 'note-added': return '💬';
      case 'incident-resolved': return '✅';
      default: return '•';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'incident-assigned': return 'text-blue-600';
      case 'status-updated': return 'text-yellow-600';
      case 'note-added': return 'text-green-600';
      case 'incident-resolved': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (onMarkAsRead) {
      await onMarkAsRead(id);
    }
    // Optimistic update
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleClearAll = async () => {
    if (onClearAll) {
      await onClearAll();
    }
    setUnreadCount(0);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h2>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <div className="flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full text-xs font-bold">
                {unreadCount}
              </div>
            )}
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {notifications.length} total, {unreadCount} unread
        </p>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No notifications
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`border-l-4 border-gray-200 dark:border-gray-700 pl-4 ${
                !notification.isRead ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                    <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                      <span className={`${getPriorityColor(notification.priority)} text-xs font-medium`}>
                        {notification.priority.toUpperCase()}
                      </span>
                      <span className="text-xs">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              
              {notification.incidentId && (
                <div className="ml-10 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <Link
                    href={`/admin/incidents/${notification.incidentId}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                  >
                    View Incident →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}