'use client';

import { useEffect, useState } from 'react';

interface ActivityItem {
  id: string;
  type: string;
  timestamp: string | Date;
  description: string;
  actor?: {
    id: string;
    name: string;
    email: string;
  };
  target?: {
    id: string;
    type: string;
    title: string;
  };
  metadata?: any;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const [feedItems, setFeedItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for demo purposes
    setTimeout(() => {
      setFeedItems(activities);
      setLoading(false);
    }, 300);
  }, [activities]);

  if (loading && feedItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-b-blue-600 w-12 h-12"></div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'incident-created': return '📝';
      case 'status-updated': return '🔄';
      case 'assigned': return '👤';
      case 'note-added': return '💬';
      default: return '•';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'incident-created': return 'text-blue-600';
      case 'status-updated': return 'text-yellow-600';
      case 'assigned': return 'text-purple-600';
      case 'note-added': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (feedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Activity Feed
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Latest security operations activities
        </p>
      </div>
      
      <div className="space-y-4">
        {feedItems.map((activity) => (
          <div key={activity.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                  <span className="text-sm">{getActivityIcon(activity.type)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {activity.actor && (
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                  {activity.actor.name}
                </div>
              )}
            </div>
            
            {activity.metadata && (
              <div className="ml-10 mt-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details
                  </p>
                  {typeof activity.metadata === 'object' && activity.metadata !== null ? (
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{String(key).replace(/_/g, ' ')}:</span>
                          <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {String(activity.metadata)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}