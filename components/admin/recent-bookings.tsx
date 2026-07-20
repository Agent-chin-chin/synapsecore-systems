'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IncidentSummary {
  _id: string;
  incidentType?: string;
  description?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  userId?: {
    fullname?: string;
    email?: string;
  };
}

export default function RecentBookings() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadIncidents = async () => {
      try {
        const response = await fetch('/api/incidents?limit=5', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to load incidents');
        const result = await response.json();
        if (!active) return;
        setIncidents(result.data?.incidents || result.incidents || []);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || 'Failed to load incidents');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadIncidents();
    return () => {
      active = false;
    };
  }, []);

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'open':
        return 'bg-sky-100 text-sky-800';
      case 'investigating':
        return 'bg-violet-100 text-violet-800';
      case 'assigned':
        return 'bg-cyan-100 text-cyan-800';
      case 'resolved':
      case 'closed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const getPriorityStyles = (priority?: string) => {
    switch (priority) {
      case 'low':
        return 'text-emerald-600';
      case 'medium':
        return 'text-amber-600';
      case 'high':
        return 'text-orange-600';
      case 'urgent':
        return 'text-red-600';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
      <div className="border-b border-slate-800 px-6 py-4">
        <h3 className="text-lg font-medium text-slate-100">Recent Incidents</h3>
      </div>
      <div className="space-y-4 p-4">
        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading incidents…</div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-950/30 p-4 text-sm text-red-300">{error}</div>
        ) : incidents.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">No incidents found.</div>
        ) : (
          incidents.map((incident) => (
            <Link key={incident._id} href={`/admin/incidents/${incident._id}`} className="block rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4 transition hover:border-cyan-500/50 hover:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-slate-100">
                    {incident.userId?.fullname || 'Customer'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {(incident.incidentType || 'Incident').replace(/-/g, ' ')} • {incident.createdAt ? new Date(incident.createdAt).toLocaleDateString() : 'Recently reported'}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyles(incident.status)}`}>
                  {(incident.status || 'open').replace(/-/g, ' ')}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs font-medium ${getPriorityStyles(incident.priority)}`}>
                  {(incident.priority || 'medium').replace(/-/g, ' ')} Priority
                </span>
                <span className="text-xs text-slate-500">{incident.userId?.email || 'No email provided'}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}