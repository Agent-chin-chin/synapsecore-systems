'use client';
import { useEffect, useState } from 'react';

export default function ResourceTable() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const res = await fetch('/api/resources');
        if (!res.ok) throw new Error('Failed to fetch resources');
        const data = await res.json();
        setResources(data.resources || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (resources.length === 0) return <div>No resources found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">URL</th>
            <th className="px-4 py-2 border">Created By</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource._id}>
              <td className="px-4 py-2 border">{resource.title}</td>
              <td className="px-4 py-2 border">{resource.type}</td>
              <td className="px-4 py-2 border"><a href={resource.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{resource.url}</a></td>
              <td className="px-4 py-2 border">{resource.createdBy?.fullname || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(resource.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
