'use client'
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Notification {
  _id: string;
  userId?: { fullname: string; email: string };
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data.data?.notifications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-white">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-900/70 px-4 py-3 text-red-100">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-8 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold mb-2">Admin Notifications</h1>
        <p className="text-slate-400">Manage system notifications and alerts.</p>
      </motion.div>

      <motion.div
        className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {notifications.map((notification, idx) => (
              <motion.tr
                key={notification._id}
                className="hover:bg-slate-900/30 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.04 }}
                whileHover={{ scale: 1.005 }}
              >
                <td className="px-6 py-4 text-slate-300">
                  {notification.userId?.fullname || 'System'}
                </td>
                <td className="px-6 py-4 text-slate-300 max-w-md">
                  {notification.message}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 capitalize">
                    {notification.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    notification.status === 'sent' ? 'bg-green-900 text-green-300' :
                    notification.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {notification.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {notifications.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No notifications found.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
