'use client';
import { useEffect, useState } from 'react';

export default function TestimonialTable() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const res = await fetch('/api/testimonials');
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (testimonials.length === 0) return <div>No testimonials found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Author</th>
            <th className="px-4 py-2 border">Content</th>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t._id}>
              <td className="px-4 py-2 border">{t.author}</td>
              <td className="px-4 py-2 border">{t.content}</td>
              <td className="px-4 py-2 border">{t.company || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
