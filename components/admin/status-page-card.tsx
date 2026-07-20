'use client';
import { useEffect, useState } from 'react';

export default function StatusPageCard() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        const res = await fetch('/api/status');
        if (!res.ok) throw new Error('Failed to fetch status');
        const data = await res.json();
        setStatus(data.status);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!status) return <div>No status available.</div>;

  let color = 'bg-green-100 text-green-800';
  if (status.status === 'degraded') color = 'bg-yellow-100 text-yellow-800';
  if (status.status === 'outage') color = 'bg-red-100 text-red-800';

  return (
    <div className={`rounded p-4 shadow ${color}`}>
      <div className="font-bold text-lg mb-2">Current Status: {status.status}</div>
      <div>{status.message}</div>
      <div className="text-xs mt-2 text-gray-500">Last updated: {new Date(status.updatedAt).toLocaleString()}</div>
    </div>
  );
}
