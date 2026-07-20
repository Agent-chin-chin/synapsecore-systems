'use client';
import { useEffect, useMemo, useState } from 'react';

export default function AuditLogTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorId, setActorId] = useState('');
  const [action, setAction] = useState('');
  const [targetType, setTargetType] = useState('');
  const [targetId, setTargetId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (actorId) params.set('actorId', actorId);
    if (action) params.set('action', action);
    if (targetType) params.set('targetType', targetType);
    if (targetId) params.set('targetId', targetId);
    params.set('page', String(page));
    params.set('limit', String(pageSize));
    return params.toString();
  }, [actorId, action, targetType, targetId, page, pageSize]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/audit-logs?${queryString}`);
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [queryString]);

  function resetFilters() {
    setActorId('');
    setAction('');
    setTargetType('');
    setTargetId('');
    setPage(1);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (logs.length === 0) return <div>No audit logs found.</div>;

  return (
    <div>
      <div className="mb-4 grid gap-3 md:grid-cols-5">
        <input
          className="rounded border px-3 py-2"
          placeholder="Actor ID"
          value={actorId}
          onChange={(e) => setActorId(e.target.value)}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Target Type"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Target ID"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-left">Time</th>
              <th className="px-4 py-2 border text-left">Actor</th>
              <th className="px-4 py-2 border text-left">Action</th>
              <th className="px-4 py-2 border text-left">Target</th>
              <th className="px-4 py-2 border text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                <td className="px-4 py-2 border align-top">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border align-top">{log.actorId?.fullname || 'System'}</td>
                <td className="px-4 py-2 border align-top">{log.action}</td>
                <td className="px-4 py-2 border align-top">{log.targetType} ({log.targetId})</td>
                <td className="px-4 py-2 border align-top break-words">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="rounded border px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <button
            className="rounded border px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
