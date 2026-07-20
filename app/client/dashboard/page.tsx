'use client'
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StatCard, StatsCardGroup } from '@/components/dashboard/stat-card';
import ActivityFeed from '@/components/dashboard/activity-feed';
import ChartsContainer from '@/components/dashboard/charts-container';
import NotificationPanel from '@/components/dashboard/notification-panel';

interface ActivityItem {
  id: string;
  type: string;
  timestamp: string;
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

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  incidentId?: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface DashboardChartData {
  severity: Array<{ severity: string; count: number }>;
  status: Array<{ status: string; count: number }>;
  trend: Array<{ date: string; count: number }>;
}

export default function ClientDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    activeIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0,
    totalIncidents: 0,
    averageResponseTime: 0,
    assignedEngineers: 0
  });
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<DashboardChartData>({
    severity: [],
    status: [],
    trend: []
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
// Fetch all dashboard data in parallel
      const [statsRes, activityRes, chartsRes, notificationsRes] = await Promise.all([
        fetch('/api/dashboard/stats', { credentials: 'include' }),
        fetch('/api/dashboard/activity', { credentials: 'include' }),
        fetch('/api/dashboard/charts', { credentials: 'include' }),
        fetch('/api/notifications', { credentials: 'include' })
      ]);

      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      if (!activityRes.ok) throw new Error('Failed to fetch activity');
      if (!chartsRes.ok) throw new Error('Failed to fetch charts');
      if (!notificationsRes.ok) throw new Error('Failed to fetch notifications');
      
      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      const chartsData = await chartsRes.json();
      const notificationsData = await notificationsRes.json();
      
      setDashboardStats(statsData.data);
      setActivityFeed(activityData.data);
      setChartData(chartsData.data);
      setNotifications(notificationsData.data.notifications || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id })
      });
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      await fetch('/api/notifications?all=true', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-b-blue-600 w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-md w-full max-w-xl">
          <h3 className="text-lg font-medium mb-2">Error loading dashboard</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] bg-gray-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid gap-6">
          {/* Left Column - Stats, Activity */}
          <div className="lg:col-span-2">
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <StatsCardGroup title="Your Incidents">
                <StatCard
                  title="Active Incidents"
                  value={dashboardStats.activeIncidents}
                  icon="⚠️"
                  color="red"
                  trend={{ value: 5, isPositive: false }}
                  link="/client/incidents"
                />
                <StatCard
                  title="Critical Incidents"
                  value={dashboardStats.criticalIncidents}
                  icon="🚨"
                  color="orange"
                  trend={{ value: 12, isPositive: false }}
                  link="/client/incidents?severity=critical"
                />
                <StatCard
                  title="Resolved Incidents"
                  value={dashboardStats.resolvedIncidents}
                  icon="✅"
                  color="green"
                  trend={{ value: 8, isPositive: true }}
                  link="/client/incidents?status=resolved"
                />
                <StatCard
                  title="Avg Response Time"
                  value={`${dashboardStats.averageResponseTime}m`}
                  icon="⏱️"
                  color="blue"
                  trend={{ value: 15, isPositive: true }}
                  link="/client/incidents?sort=response-time"
                />
                <StatCard
                  title="Total Incidents"
                  value={dashboardStats.totalIncidents}
                  icon="📋"
                  color="gray"
                  trend={{ value: 2, isPositive: false }}
                  link="/client/incidents"
                />
                <StatCard
                  title="Report New Incident"
                  value="+ New"
                  icon="📝"
                  color="purple"
                  link="/client/incidents/new"
                />
              </StatsCardGroup>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ActivityFeed activities={activityFeed} />
            </motion.div>
          </div>

          {/* Right Column - Notifications & Quick Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
              />
            </motion.div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Link
                    href="/client/incidents/new"
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        📝
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Report Incident</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quickly report a new security issue
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Link
                    href="/client/incidents"
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        📋
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">View All Incidents</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          See status and details of your reports
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Link
                    href="/contact"
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                        📞
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Contact Support</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get immediate help from our team
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
