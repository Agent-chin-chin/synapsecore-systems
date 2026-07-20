'use client';
import { useEffect, useState } from 'react';

export default function CustomerStoryTable() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const res = await fetch('/api/customer-stories');
        if (!res.ok) throw new Error('Failed to fetch customer stories');
        const data = await res.json();
        setStories(data.stories || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (stories.length === 0) return <div>No customer stories found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Story</th>
            <th className="px-4 py-2 border">Logo</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story._id}>
              <td className="px-4 py-2 border">{story.customerName}</td>
              <td className="px-4 py-2 border">{story.story}</td>
              <td className="px-4 py-2 border">{story.logoUrl ? <img src={story.logoUrl} alt="logo" className="h-8" /> : 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(story.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
