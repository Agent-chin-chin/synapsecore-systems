'use client';
import { useEffect, useState } from 'react';

export default function ChangelogTable() {
  const [changelogs, setChangelogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChangelogs() {
      try {
        setLoading(true);
        const res = await fetch('/api/changelogs');
        if (!res.ok) throw new Error('Failed to fetch changelogs');
        const data = await res.json();
        setChangelogs(data.changelogs || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchChangelogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (changelogs.length === 0) return <div>No changelogs found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Version</th>
            <th className="px-4 py-2 border">Released At</th>
            <th className="px-4 py-2 border">Created By</th>
          </tr>
        </thead>
        <tbody>
          {changelogs.map((c) => (
            <tr key={c._id}>
              <td className="px-4 py-2 border">{c.title}</td>
              <td className="px-4 py-2 border">{c.description}</td>
              <td className="px-4 py-2 border">{c.version}</td>
              <td className="px-4 py-2 border">{new Date(c.releasedAt).toLocaleString()}</td>
              <td className="px-4 py-2 border">{c.createdBy?.fullname || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
