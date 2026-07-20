'use client';

import React from 'react';
import { colors } from '@/styles/design-system/colors';
import { effects } from '@/styles/design-system/effects';

interface DashboardPanelProps {
  title?: string;
  status?: 'operational' | 'warning' | 'critical' | 'offline';
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const statusStyles = {
  operational: {
    indicator: colors.status.operational,
    glow: effects.glow.operational,
  },
  warning: {
    indicator: colors.status.warning,
    glow: '0 0 20px rgba(245, 158, 11, 0.2)',
  },
  critical: {
    indicator: colors.status.critical,
    glow: effects.glow.critical,
  },
  offline: {
    indicator: colors.status.offline,
    glow: 'none',
  },
};

export function DashboardPanel({
  title,
  status = 'operational',
  children,
  className = '',
  compact = false
}: DashboardPanelProps) {
  const statusStyle = statusStyles[status];

  return (
    <div
      className={`
        rounded-2xl border backdrop-blur-sm
        ${compact ? 'p-4' : 'p-6'}
        ${className}
      `}
      style={{
        border: `1px solid ${colors.border?.subtle || 'rgba(255,255,255,0.08)'}`,
        background: colors.background?.secondary || colors.background?.primary,
        boxShadow: effects.shadow?.operational ? `${effects.shadow.operational}, ${statusStyle.glow}` : statusStyle.glow,
      }}
    >
      {(title || status) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {status && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: statusStyle.indicator }}
              />
              <span
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: statusStyle.indicator }}
              >
                {status}
              </span>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}