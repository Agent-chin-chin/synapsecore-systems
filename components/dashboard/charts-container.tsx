'use client';

import { useEffect, useState } from 'react';

interface ChartData {
  severity: Array<{ severity: string; count: number }>;
  status: Array<{ status: string; count: number }>;
  trend: Array<{ date: string; count: number }>;
}

interface ChartsContainerProps {
  data: ChartData;
}

export default function ChartsContainer({ data }: ChartsContainerProps) {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Security Analytics
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visual insights into incident patterns and trends
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* Severity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Incidents by Severity
          </h3>
          <div className="space-y-3">
            {data.severity.map((item) => (
              <div key={item.severity} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" 
                       style={{ backgroundColor: getSeverityColor(item.severity) }}></div>
                  <span className="text-sm font-medium capitalize">
                    {item.severity}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Incidents by Status
          </h3>
          <div className="space-y-3">
            {data.status.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" 
                       style={{ backgroundColor: getStatusColor(item.status) }}></div>
                  <span className="text-sm font-medium capitalize">
                    {item.status}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Incident Trends (Weekly)
          </h3>
          {data.trend.length > 0 ? (
            <div className="space-y-3">
              {data.trend.map((item) => (
                <div key={item.date} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No trend data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'low': return '#10b981'; // green
    case 'medium': return '#f59e0b'; // amber
    case 'high': return '#ef4444'; // red
    case 'critical': return '#7c2d12'; // dark red
    default: return '#6b7280'; // gray
  }
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'open': return '#ef4444'; // red
    case 'investigating': return '#f59e0b'; // amber
    case 'assigned': return '#3b82f6'; // blue
    case 'resolved': return '#10b981'; // green
    case 'closed': return '#6b7280'; // gray
    default: return '#6b7280'; // gray
  }
}