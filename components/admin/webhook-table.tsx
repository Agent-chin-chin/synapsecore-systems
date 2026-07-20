'use client';
import { useEffect, useState } from 'react';

export default function WebhookTable() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWebhooks() {
      try {
        setLoading(true);
        const res = await fetch('/api/webhooks');
        if (!res.ok) throw new Error('Failed to fetch webhooks');
        const data = await res.json();
        setWebhooks(data.webhooks || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWebhooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (webhooks.length === 0) return <div>No webhooks found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">URL</th>
            <th className="px-4 py-2 border">Event</th>
            <th className="px-4 py-2 border">Enabled</th>
            <th className="px-4 py-2 border">Created By</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((webhook) => (
            <tr key={webhook._id}>
              <td className="px-4 py-2 border">{webhook.url}</td>
              <td className="px-4 py-2 border">{webhook.event}</td>
              <td className="px-4 py-2 border">{webhook.enabled ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 border">{webhook.createdBy?.fullname || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(webhook.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
