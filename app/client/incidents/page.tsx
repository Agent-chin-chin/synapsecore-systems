'use client'
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/status-badge';

type IncidentStatus = 'open' | 'investigating' | 'assigned' | 'resolved' | 'closed';

interface ClientIncident {
  _id: string;
  incidentType: string;
  description: string;
  priority: string;
  severity: string;
  status: IncidentStatus;
  assignedTo?: {
    fullname: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export default function ClientIncidentsPage() {
  const [incidents, setIncidents] = useState<ClientIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, [filter]);

  async function fetchIncidents() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const res = await fetch(`/api/incidents?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await res.json();
      setIncidents(data.incidents || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-600';
      case 'investigating':
        return 'text-yellow-600';
      case 'assigned':
        return 'text-blue-600';
      case 'resolved':
        return 'text-green-600';
      case 'closed':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-md w-full max-w-xl">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => fetchIncidents()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Your Incidents
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track the status of your reported incidents and get updates from our support team
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex gap-2 flex-wrap">
            {['all', 'open', 'investigating', 'assigned', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Incidents List */}
        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No incidents found
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident, index) => (
              <motion.div
                key={incident._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <Link
                  href={`/client/incidents/${incident._id}`}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {incident.incidentType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        #{incident._id.slice(-8)}
                      </p>
                    </div>
                    <StatusBadge status={incident.status} />
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {incident.description}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {incident.priority}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Severity</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {incident.severity}
                        </p>
                      </div>
                    </div>

                    {incident.assignedTo && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {incident.assignedTo.fullname}
                        </p>
                      </div>
                    )}

                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
