'use client'
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Incident {
  _id: string;
  incidentCode: string;
  incidentType: string;
  description: string;
  priority: string;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: { fullname: string; email: string };
  assignedTo?: { fullname: string };
}

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/incidents', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIncidents(data.incidents || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load incidents');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold">Incidents</h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/admin/incidents/new"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
          >
            + New Incident
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {incidents.map((incident, idx) => (
              <motion.tr
                key={incident._id}
                className="hover:bg-slate-900/30 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.03 }}
                whileHover={{ scale: 1.005 }}
              >
                <td className="px-6 py-4">
                  <Link href={`/admin/incidents/${incident._id}`} className="text-cyan-400 hover:text-cyan-300">
                    #{incident.incidentCode || incident._id.slice(-8)}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-300 capitalize">
                  {incident.incidentType?.replace(/-/g, ' ')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    incident.priority === 'urgent' ? 'bg-red-900 text-red-300' :
                    incident.priority === 'high' ? 'bg-orange-900 text-orange-300' :
                    incident.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {incident.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    incident.severity === 'critical' ? 'bg-red-900 text-red-300' :
                    incident.severity === 'high' ? 'bg-orange-900 text-orange-300' :
                    incident.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    incident.status === 'open' ? 'bg-blue-900 text-blue-300' :
                    incident.status === 'investigating' ? 'bg-purple-900 text-purple-300' :
                    incident.status === 'assigned' ? 'bg-cyan-900 text-cyan-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {incident.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {incident.userId?.fullname || 'N/A'}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {incident.assignedTo?.fullname || '-'}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {incidents.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-400">No incidents found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
