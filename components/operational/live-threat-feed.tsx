'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';

interface ThreatItem {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  timestamp: Date;
  source: string;
}

const severityTypes: ThreatItem['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const sourceOptions = ['Firewall', 'IDS', 'Endpoint', 'Cloud'] as const;
const threatMessages = [
  'Unusual API call pattern detected',
  'Brute force attempt blocked',
  'Suspicious file access detected',
  'External scan attempt blocked',
];

const mockThreats: ThreatItem[] = [
  {
    id: '1',
    severity: 'CRITICAL',
    message: 'Endpoint anomaly detected - unusual outbound traffic',
    timestamp: new Date(Date.now() - 30000),
    source: 'Network Monitor',
  },
  {
    id: '2',
    severity: 'HIGH',
    message: 'Suspicious login attempt from unknown IP',
    timestamp: new Date(Date.now() - 120000),
    source: 'Auth System',
  },
  {
    id: '3',
    severity: 'MEDIUM',
    message: 'AI classified phishing activity in email queue',
    timestamp: new Date(Date.now() - 240000),
    source: 'Email Gateway',
  },
];

export function LiveThreatFeed() {
  const [threats, setThreats] = useState<ThreatItem[]>(mockThreats);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const severity = severityTypes[Math.floor(Math.random() * severityTypes.length)];
      const message = threatMessages[Math.floor(Math.random() * threatMessages.length)];
      const source = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];

      const newThreat: ThreatItem = {
        id: Date.now().toString(),
        severity,
        message,
        timestamp: new Date(),
        source,
      };

      setThreats((prev) => [newThreat, ...prev.slice(0, 4)]);
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  const getColor = (severity: ThreatItem['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f59e0b';
      case 'MEDIUM':
        return '#3b82f6';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Threat Feed</h3>
        <StatusBadge status="operational" size="sm">
          ACTIVE
        </StatusBadge>
      </div>

      <div className="space-y-2 max-h-64 overflow-hidden">
        {threats.map((threat, index) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-3 rounded-lg border border-slate-700 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold"
                style={{ color: getColor(threat.severity) }}
              >
                {threat.severity}
              </span>
              <span className="text-xs text-gray-400">
                {threat.source}
              </span>
            </div>

            <p className="text-sm text-gray-200">
              {threat.message}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {threat.timestamp.toLocaleTimeString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}