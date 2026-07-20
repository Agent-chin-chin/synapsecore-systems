'use client';

import { useEffect, useState } from 'react';

interface ChartSeriesData {
  severity: Array<{ severity: string; count: number }>;
  status: Array<{ status: string; count: number }>;
  trend: Array<{ date: string; count: number }>;
}

export default function AnalyticsChart() {
  const [chartData, setChartData] = useState<ChartSeriesData>({ severity: [], status: [], trend: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const response = await fetch('/api/dashboard/charts?range=30d', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to load chart data');
        const result = await response.json();
        setChartData(result.data || { severity: [], status: [], trend: [] });
      } catch (err: any) {
        setError(err.message || 'Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
      <div className="border-b border-slate-800 px-6 py-4">
        <h3 className="text-lg font-medium text-slate-100">Operational Overview</h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading chart data…</div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-950/30 p-4 text-sm text-red-300">{error}</div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Severity breakdown</h4>
              <div className="space-y-3">
                {chartData.severity.map((item) => (
                  <div key={item.severity}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                      <span className="capitalize">{item.severity}</span>
                      <span className="font-semibold text-slate-100">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${Math.max(8, (item.count / Math.max(1, chartData.severity.reduce((sum, entry) => sum + entry.count, 0))) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Recent trend</h4>
              <div className="space-y-3">
                {chartData.trend.slice(-6).map((item) => (
                  <div key={item.date}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                      <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="font-semibold text-slate-100">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, item.count * 12)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}