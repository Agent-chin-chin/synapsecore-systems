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
  engineer: { fullname: string; email: string };
  note: string;
  isInternal: boolean;
  createdAt: string;
}

interface IncidentDetail {
  _id: string;
  incidentType: string;
  description: string;
  priority: string;
  severity: string;
  status: IncidentStatus;
  incidentCode?: string;
  statusHistory: StatusHistory[];
  assignedTo?: { fullname: string; email: string };
  responseNotes: ResponseNote[];
  userId: { fullname: string; email: string };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export default function IncidentDetailsPage() {
  const params = useParams();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

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

  async function handleStatusChange(newStatus: IncidentStatus) {
    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/incidents/${incidentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-status',
          status: newStatus,
          notes: `Status updated to ${newStatus}`
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update incident');
      }

      const data = await res.json();
      setIncident(data.incident);
    } catch (err: any) {
      setError(err.message || 'Failed to update incident');
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      const res = await fetch(`/api/incidents/${incidentId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: newNote,
          isInternal: true
        })
      });

      if (!res.ok) {
        throw new Error('Failed to add note');
      }

      const data = await res.json();
      setIncident(data.incident);
      setNewNote('');
    } catch (err: any) {
      setError(err.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
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

  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Incident #{incident.incidentCode || incident._id.slice(-8)}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {incident.incidentType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
            <StatusBadge status={incident.status} />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Incident Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Incident Summary
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
                      Status
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
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Status History
              </h2>
              <div className="space-y-3">
                {incident.statusHistory.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <div className="mt-1 h-3 w-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {entry.status}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Response Notes */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Internal Notes
              </h2>

              {/* Add Note Form */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  onClick={handleAddNote}
                  disabled={addingNote || !newNote.trim()}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {addingNote ? 'Adding...' : 'Add Note'}
                </motion.button>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {incident.responseNotes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
                ) : (
                  incident.responseNotes.map((note) => (
                    <motion.div
                      key={note._id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {note.engineer.fullname}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{note.note}</p>
                      {note.isInternal && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">🔒 Internal</p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Actions & Assignment */}
          <div className="space-y-6">
            {/* Assignment Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Assignment
              </h3>
              {incident.assignedTo ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to:</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {incident.assignedTo.fullname}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {incident.assignedTo.email}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Unassigned</p>
              )}
            </motion.div>

            {/* Status Update Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Update Status
              </h3>
              <div className="space-y-2">
                {(['open', 'investigating', 'assigned', 'resolved', 'closed'] as IncidentStatus[]).map((status, idx) => (
                  <motion.button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus || status === incident.status}
                    className="w-full px-4 py-2 text-left capitalize bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-md disabled:opacity-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Customer Info Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Customer
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {incident.userId.fullname}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {incident.userId.email}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(incident.createdAt).toLocaleDateString()}
                  </p>
                  {incident.resolvedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Resolved: {new Date(incident.resolvedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
