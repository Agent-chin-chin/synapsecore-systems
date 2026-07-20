'use client';
import { useEffect, useState } from 'react';

export default function FaqTable() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        setLoading(true);
        const res = await fetch('/api/faqs');
        if (!res.ok) throw new Error('Failed to fetch FAQs');
        const data = await res.json();
        setFaqs(data.faqs || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (faqs.length === 0) return <div>No FAQs found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Question</th>
            <th className="px-4 py-2 border">Answer</th>
            <th className="px-4 py-2 border">Created By</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr key={faq._id}>
              <td className="px-4 py-2 border">{faq.question}</td>
              <td className="px-4 py-2 border">{faq.answer}</td>
              <td className="px-4 py-2 border">{faq.createdBy?.fullname || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(faq.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
