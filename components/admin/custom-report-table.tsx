'use client';
import { useEffect, useState } from 'react';

export default function CustomReportTable() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const res = await fetch('/api/custom-reports');
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (reports.length === 0) return <div>No custom reports found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Created By</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td className="px-4 py-2 border">{report.title}</td>
              <td className="px-4 py-2 border">{report.description}</td>
              <td className="px-4 py-2 border">{report.createdBy?.fullname || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(report.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
