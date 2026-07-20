'use client'
'use client';

import { useEffect, useState } from 'react';
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

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    activeIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0,
    totalIncidents: 0,
    averageResponseTime: 0,
    assignedEngineers: 0,
  });
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<DashboardChartData>({
    severity: [],
    status: [],
    trend: [],
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const [statsRes, activityRes, chartsRes, notificationsRes] = await Promise.all([
        fetch('/api/dashboard/stats', { credentials: 'include' }),
        fetch('/api/dashboard/activity', { credentials: 'include' }),
        fetch('/api/dashboard/charts', { credentials: 'include' }),
        fetch('/api/notifications', { credentials: 'include' }),
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

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch('/api/notifications?all=true', {
        method: 'DELETE',
        credentials: 'include',
      });
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-red-500/20 bg-slate-900/90 p-6 text-red-100 shadow-lg shadow-red-950/20">
          <h3 className="text-lg font-semibold">Error loading dashboard</h3>
          <p className="mt-2 text-sm text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-8 px-4 py-6 md:px-6">
        <motion.div
          className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Security Operations Dashboard</h1>
              <p className="mt-2 text-sm text-slate-400">Monitor active incidents, team performance, and service health from a single admin view.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300 shadow-sm shadow-slate-950/20">
                <span className="h-10 w-10 rounded-3xl bg-cyan-500 text-center text-lg leading-10 text-slate-950">A</span>
                <div>
                  <p className="font-semibold text-white">Admin</p>
                  <p className="text-xs text-slate-500">SynapseCore</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                  window.location.href = '/admin/login';
                }}
                className="rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCardGroup title="Overview">
            <StatCard title="Active Incidents" value={dashboardStats.activeIncidents} icon="⚠️" color="red" trend={{ value: 5, isPositive: false }} link="/admin/incidents" />
            <StatCard title="Critical Incidents" value={dashboardStats.criticalIncidents} icon="🚨" color="orange" trend={{ value: 12, isPositive: false }} link="/admin/incidents?severity=critical" />
            <StatCard title="Resolved Today" value={dashboardStats.resolvedIncidents} icon="✅" color="green" trend={{ value: 8, isPositive: true }} link="/admin/incidents?status=resolved" />
            <StatCard title="Avg Response Time" value={`${dashboardStats.averageResponseTime}m`} icon="⏱️" color="blue" trend={{ value: 15, isPositive: true }} link="/admin/incidents?sort=response-time" />
            <StatCard title="Assigned Engineers" value={dashboardStats.assignedEngineers} icon="👥" color="purple" trend={{ value: 3, isPositive: true }} link="/admin/users" />
            <StatCard title="Total Incidents" value={dashboardStats.totalIncidents} icon="📋" color="gray" trend={{ value: 2, isPositive: false }} link="/admin/incidents" />
          </StatsCardGroup>
        </motion.div>

        <motion.div
          className="grid gap-6 xl:grid-cols-[2fr_1fr]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-6">
            <ActivityFeed activities={activityFeed} />
            <ChartsContainer data={chartData} />
          </div>
          <div>
            <NotificationPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} onClearAll={handleClearAll} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
