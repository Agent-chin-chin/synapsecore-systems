'use client';
import { useEffect, useState } from 'react';

export default function IncidentTimelineTable() {
  const [timelines, setTimelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimelines() {
      try {
        setLoading(true);
        const res = await fetch('/api/incident-timeline');
        if (!res.ok) throw new Error('Failed to fetch incident timelines');
        const data = await res.json();
        setTimelines(data.timelines || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTimelines();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (timelines.length === 0) return <div>No incident timeline events found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Incident</th>
            <th className="px-4 py-2 border">Event</th>
            <th className="px-4 py-2 border">Details</th>
            <th className="px-4 py-2 border">Timestamp</th>
            <th className="px-4 py-2 border">Created By</th>
          </tr>
        </thead>
        <tbody>
          {timelines.map((t) => (
            <tr key={t._id}>
              <td className="px-4 py-2 border">{t.incidentId?._id || 'N/A'}</td>
              <td className="px-4 py-2 border">{t.event}</td>
              <td className="px-4 py-2 border">{t.details}</td>
              <td className="px-4 py-2 border">{new Date(t.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2 border">{t.createdBy?.fullname || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
