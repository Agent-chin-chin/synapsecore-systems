'use client';
import { useEffect, useState } from 'react';

export default function ThreatFeedTable() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        setLoading(true);
        const res = await fetch('/api/threat-feed');
        if (!res.ok) throw new Error('Failed to fetch threat feeds');
        const data = await res.json();
        setFeeds(data.feeds || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (feeds.length === 0) return <div>No threat feeds found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Severity</th>
            <th className="px-4 py-2 border">Source</th>
            <th className="px-4 py-2 border">Published At</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => (
            <tr key={feed._id}>
              <td className="px-4 py-2 border">{feed.title}</td>
              <td className="px-4 py-2 border">{feed.description}</td>
              <td className="px-4 py-2 border">{feed.severity}</td>
              <td className="px-4 py-2 border">{feed.source}</td>
              <td className="px-4 py-2 border">{new Date(feed.publishedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
