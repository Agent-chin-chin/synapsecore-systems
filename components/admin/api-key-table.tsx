'use client';
import { useEffect, useState } from 'react';

export default function ApiKeyTable() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApiKeys() {
      try {
        setLoading(true);
        const res = await fetch('/api/api-keys');
        if (!res.ok) throw new Error('Failed to fetch API keys');
        const data = await res.json();
        setApiKeys(data.apiKeys || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApiKeys();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (apiKeys.length === 0) return <div>No API keys found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Key</th>
            <th className="px-4 py-2 border">Label</th>
            <th className="px-4 py-2 border">User</th>
            <th className="px-4 py-2 border">Scopes</th>
            <th className="px-4 py-2 border">Active</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key._id}>
              <td className="px-4 py-2 border font-mono text-xs">{key.key}</td>
              <td className="px-4 py-2 border">{key.label}</td>
              <td className="px-4 py-2 border">{key.user?.fullname || 'N/A'}</td>
              <td className="px-4 py-2 border">{key.scopes?.join(', ')}</td>
              <td className="px-4 py-2 border">{key.active ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 border">{new Date(key.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
