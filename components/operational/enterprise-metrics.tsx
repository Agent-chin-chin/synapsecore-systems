'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MetricCounter } from '@/components/ui/metric-counter';
import { StatusBadge } from '@/components/ui/status-badge';
import { TacticalCard } from '@/components/ui/tactical-card';
import { colors } from '@/styles/design-system';

interface MetricItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  variant: 'default' | 'ai' | 'operational' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  description?: string;
}

const enterpriseMetrics: MetricItem[] = [
  {
    id: 'uptime',
    label: 'System Uptime',
    value: 99,
    suffix: '.97%',
    variant: 'operational',
    trend: 'up',
    trendValue: '+0.02%',
    description: '99.97% uptime across all systems'
  },
  {
    id: 'analysts',
    label: 'Active Analysts',
    value: 8,
    variant: 'ai',
    trend: 'stable',
    description: 'SOC analysts currently online'
  },
  {
    id: 'incidents',
    label: 'Incidents Resolved',
    value: 1247,
    variant: 'default',
    trend: 'up',
    trendValue: '+18 today',
    description: 'Total incidents handled this month'
  },
  {
    id: 'protected',
    label: 'Systems Protected',
    value: 2840,
    variant: 'operational',
    trend: 'up',
    trendValue: '+12 this week',
    description: 'Endpoints and servers under protection'
  },
  {
    id: 'response',
    label: 'Avg Response Time',
    value: 28,
    suffix: 's',
    variant: 'ai',
    trend: 'down',
    trendValue: '-3s',
    description: 'Average time to initial response'
  },
  {
    id: 'threats',
    label: 'Threats Blocked',
    value: 1284,
    variant: 'critical',
    trend: 'up',
    trendValue: '+47 today',
    description: 'Malicious activities prevented'
  }
];

const getTrendIcon = (trend: MetricItem['trend']) => {
  switch (trend) {
    case 'up': return '↗️';
    case 'down': return '↘️';
    case 'stable': return '→';
    default: return '';
  }
};

const getTrendColor = (trend: MetricItem['trend']) => {
  switch (trend) {
    case 'up': return 'text-emerald-400';
    case 'down': return 'text-red-400';
    case 'stable': return 'text-slate-400';
    default: return 'text-slate-400';
  }
};

export function EnterpriseMetrics() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3"
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-emerald-400"
            animate={{ boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 10px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm uppercase tracking-wider text-emerald-400 font-semibold">
            Enterprise Performance
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-white"
        >
          Real-Time Security Operations Metrics
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          Comprehensive visibility into your security posture with live metrics, performance indicators, and operational insights.
        </motion.p>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enterpriseMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <TacticalCard variant="default" glow className="p-6 h-full">
              <div className="space-y-4">
                {/* Metric Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{metric.label}</h3>
                    <p className="text-sm text-slate-400">{metric.description}</p>
                  </div>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
                      <span>{getTrendIcon(metric.trend)}</span>
                      <span>{metric.trendValue}</span>
                    </div>
                  )}
                </div>

                {/* Metric Value */}
                <div className="flex items-baseline gap-2">
                  <MetricCounter
                    value={metric.value}
                    label=""
                    suffix={metric.suffix}
                    variant={metric.variant}
                  />
                </div>

                {/* Visual Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Performance</span>
                    <span>
                      {metric.variant === 'operational' ? 'Excellent' :
                       metric.variant === 'ai' ? 'Optimal' :
                       metric.variant === 'critical' ? 'Critical' : 'Good'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <motion.div
                      className={`h-1.5 rounded-full ${
                        metric.variant === 'operational' ? 'bg-emerald-400' :
                        metric.variant === 'ai' ? 'bg-cyan-400' :
                        metric.variant === 'critical' ? 'bg-red-400' : 'bg-blue-400'
                      }`}
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      transition={{ duration: 1.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </div>
            </TacticalCard>
          </motion.div>
        ))}
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 backdrop-blur-sm"
      >
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">99.97%</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Platform Reliability</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">28s</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Mean Time to Respond</div>
            <div className="text-xs text-slate-500 mt-1">Industry leading</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Threat Detection Rate</div>
            <div className="text-xs text-slate-500 mt-1">Zero false negatives</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}