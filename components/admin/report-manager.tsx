'use client';
import { useState } from 'react';

const reportTypes = [
  { value: 'summary', label: 'Summary' },
  { value: 'bookings', label: 'Bookings' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'user-activity', label: 'User Activity' }
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ReportManager() {
  const [type, setType] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const queryParams = new URLSearchParams();
  queryParams.set('type', type);
  if (startDate) queryParams.set('startDate', startDate);
  if (endDate) queryParams.set('endDate', endDate);

  async function fetchReport(format: 'json' | 'csv' | 'pdf') {
    setError(null);
    setMessage(null);
    setLoading(true);
    setReportData(null);

    try {
      queryParams.set('format', format);
      const response = await fetch(`/api/reports?${queryParams.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch report');
      }

      if (format === 'json') {
        const json = await response.json();
        setReportData(json);
        setMessage('Report data loaded successfully.');
        return;
      }

      const blob = await response.blob();
      const filename = `synapsecore-${type}-report-${new Date().toISOString().slice(0, 10)}.${format}`;
      downloadBlob(blob, filename);
      setMessage(`${format.toUpperCase()} download started.`);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Report Type</span>
          <select
            className="rounded border px-3 py-2"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {reportTypes.map((report) => (
              <option key={report.value} value={report.value}>
                {report.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Start Date</span>
          <input
            type="date"
            className="rounded border px-3 py-2"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">End Date</span>
          <input
            type="date"
            className="rounded border px-3 py-2"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            onClick={() => fetchReport('json')}
            disabled={loading}
          >
            View JSON
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          onClick={() => fetchReport('csv')}
          disabled={loading}
        >
          Download CSV
        </button>
        <button
          type="button"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          onClick={() => fetchReport('pdf')}
          disabled={loading}
        >
          Download PDF
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500">Preparing report...</div>}
      {error && <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {reportData && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
