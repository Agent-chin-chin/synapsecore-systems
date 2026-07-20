'use client';
import { useEffect, useState } from 'react';

export default function IntegrationTable() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        setLoading(true);
        const res = await fetch('/api/integrations');
        if (!res.ok) throw new Error('Failed to fetch integrations');
        const data = await res.json();
        setIntegrations(data.integrations || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchIntegrations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (integrations.length === 0) return <div>No integrations found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Enabled</th>
            <th className="px-4 py-2 border">Created By</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {integrations.map((integration) => (
            <tr key={integration._id}>
              <td className="px-4 py-2 border">{integration.name}</td>
              <td className="px-4 py-2 border">{integration.type}</td>
              <td className="px-4 py-2 border">{integration.enabled ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 border">{integration.createdBy?.fullname || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(integration.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
