'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/status-badge';

type IncidentStatus = 'open' | 'investigating' | 'assigned' | 'resolved' | 'closed';

interface StatusHistory {
  status: IncidentStatus;
  timestamp: string;
  notes?: string;
}

interface ResponseNote {
  _id: string;
  engineer: { fullname: string };
  note: string;
  isInternal: boolean;
  createdAt: string;
}

interface ClientIncidentDetail {
  _id: string;
  incidentType: string;
  description: string;
  priority: string;
  severity: string;
  status: IncidentStatus;
  statusHistory: StatusHistory[];
  assignedTo?: { fullname: string };
  responseNotes: ResponseNote[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export default function ClientIncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<ClientIncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncident();
  }, [incidentId]);

  async function fetchIncident() {
    try {
      setLoading(true);
      const res = await fetch(`/api/incidents/${incidentId}`, { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch incident');
      }
      const data = await res.json();
      setIncident(data.incident);
    } catch (err: any) {
      setError(err.message || 'Failed to load incident');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-b-blue-600 w-12 h-12"></div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-md w-full max-w-xl">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p className="text-sm">{error || 'Incident not found'}</p>
        </div>
      </div>
    );
  }

  // Filter out internal notes for clients
  const publicNotes = incident.responseNotes.filter((note) => !note.isInternal);

  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Incident #{incident._id.slice(-8)}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {incident.incidentType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
            <StatusBadge status={incident.status} />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Summary Card */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Incident Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100">{incident.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Priority
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{incident.priority}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Severity
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{incident.severity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Current Status
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={incident.status} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Timeline */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Status Updates
            </h2>
            <div className="space-y-3">
              {incident.statusHistory.map((entry, idx) => (
                <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {entry.status.replace(/^\w/, (c) => c.toUpperCase())}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support Updates */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Support Updates
            </h2>

            {publicNotes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No updates yet. Our team will keep you informed of the progress.
              </p>
            ) : (
              <div className="space-y-4">
                {publicNotes.map((note, idx) => (
                  <motion.div
                    key={note._id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * idx }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {note.engineer.fullname}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{note.note}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Assignment Info */}
          {incident.assignedTo && (
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Your Assigned Support Engineer
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                {incident.assignedTo.fullname}
              </p>
            </motion.div>
          )}

          {/* Timeline Info */}
          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Opened
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </p>
              </div>
              {incident.resolvedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Resolved
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(incident.resolvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
