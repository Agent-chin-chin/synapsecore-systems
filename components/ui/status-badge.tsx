'use client';

import React from 'react';
import { colors, effects } from '@/styles/design-system';

type StatusBadgeStatus =
  | 'operational'
  | 'warning'
  | 'critical'
  | 'investigating'
  | 'resolved'
  | 'offline';

interface StatusBadgeProps {
  status: StatusBadgeStatus | string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusConfig: Record<StatusBadgeStatus, {
  color: string;
  bg: string;
  border: string;
  glow: string;
  label: string;
}> = {
  operational: {
    color: colors.status.operational,
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    glow: effects.glow.operational,
    label: 'Operational',
  },
  warning: {
    color: colors.status.warning,
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    glow: '0 0 15px rgba(245, 158, 11, 0.2)',
    label: 'Warning',
  },
  critical: {
    color: colors.status.critical,
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    glow: effects.glow.critical,
    label: 'Critical',
  },
  investigating: {
    color: colors.status.investigating,
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    glow: '0 0 15px rgba(59, 130, 246, 0.2)',
    label: 'Investigating',
  },
  resolved: {
    color: colors.status.resolved,
    bg: 'rgba(107, 114, 128, 0.1)',
    border: 'rgba(107, 114, 128, 0.3)',
    glow: 'none',
    label: 'Resolved',
  },
  offline: {
    color: colors.status.offline,
    bg: 'rgba(55, 65, 81, 0.1)',
    border: 'rgba(55, 65, 81, 0.3)',
    glow: 'none',
    label: 'Offline',
  },
};

const sizeConfig = {
  sm: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    indicatorSize: 'w-1.5 h-1.5',
  },
  md: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    indicatorSize: 'w-2 h-2',
  },
  lg: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    indicatorSize: 'w-2.5 h-2.5',
  },
};

const fallbackConfig = {
  color: colors.text.secondary,
  bg: 'rgba(148, 163, 184, 0.12)',
  border: 'rgba(148, 163, 184, 0.24)',
  glow: 'none',
  label: 'Unknown',
};

export function StatusBadge({
  status,
  children,
  size = 'md',
  animated = true,
}: StatusBadgeProps) {
  const badgeStatus = (status in statusConfig ? status : 'offline') as StatusBadgeStatus;
  const config = statusConfig[badgeStatus] ?? fallbackConfig;
  const sizeStyle = sizeConfig[size] ?? sizeConfig.md;
  const labelText = children ?? config.label ?? String(status ?? '').toUpperCase();

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full border backdrop-blur-sm
        font-medium uppercase tracking-wider
        ${animated ? 'transition-all duration-300' : ''}
      `}
      style={{
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.border,
        boxShadow: config.glow,
      }}
    >
      <div
        className={`${sizeStyle.indicatorSize} rounded-full ${animated ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      {labelText}
    </div>
  );
}