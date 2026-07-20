'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import { TacticalCard } from '@/components/ui/tactical-card';
import { colors } from '@/styles/design-system';

interface TimelineStage {
  id: string;
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  title: string;
  description: string;
  timestamp: Date;
  duration?: string;
  analyst?: string;
}

const mockTimeline: TimelineStage[] = [
  {
    id: '1',
    status: 'detected',
    title: 'Threat Detected',
    description: 'AI anomaly detection triggered on endpoint behavior',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    duration: '00:15',
    analyst: 'SOC Analyst'
  },
  {
    id: '2',
    status: 'investigating',
    title: 'Investigation Started',
    description: 'Security team initiated forensic analysis and containment procedures',
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    duration: '00:25',
    analyst: 'Lead Investigator'
  },
  {
    id: '3',
    status: 'contained',
    title: 'Threat Contained',
    description: 'Affected systems isolated, malicious processes terminated',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    duration: '00:12',
    analyst: 'Response Team'
  },
  {
    id: '4',
    status: 'resolved',
    title: 'Incident Resolved',
    description: 'Root cause identified, remediation completed, monitoring active',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    duration: '00:02',
    analyst: 'SOC Lead'
  }
];

const getStatusColor = (status: TimelineStage['status']) => {
  switch (status) {
    case 'detected': return 'red';
    case 'investigating': return 'yellow';
    case 'contained': return 'blue';
    case 'resolved': return 'emerald';
    default: return 'slate';
  }
};

const getStatusIcon = (status: TimelineStage['status']) => {
  switch (status) {
    case 'detected': return '🚨';
    case 'investigating': return '🔍';
    case 'contained': return '🛡️';
    case 'resolved': return '✅';
    default: return '📊';
  }
};

export function ResponseTimeline() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            className="w-3 h-3 rounded-full bg-blue-400"
            animate={{ boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm uppercase tracking-wider text-blue-400 font-semibold">
            Incident Response Timeline
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-white"
        >
          Automated Response Orchestration
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          From detection to resolution, our platform orchestrates every step of the incident response lifecycle with precision and speed.
        </motion.p>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-600 via-slate-500 to-slate-600" />

        {/* Timeline Stages */}
        <div className="space-y-8">
          {mockTimeline.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative flex items-start gap-6"
            >
              {/* Timeline Node */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl shadow-lg ${
                    stage.status === 'resolved'
                      ? 'bg-emerald-500/20 border-emerald-400/50 shadow-emerald-500/25'
                      : 'bg-slate-800/80 border-slate-600 backdrop-blur-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {getStatusIcon(stage.status)}
                </motion.div>
                {index < mockTimeline.length - 1 && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-slate-600" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 min-w-0">
                <TacticalCard variant="default" className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{stage.title}</h3>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={stage.status === 'resolved' ? 'operational' : 'investigating'} size="sm">
                            {stage.status.toUpperCase()}
                          </StatusBadge>
                          {stage.analyst && (
                            <span className="text-sm text-slate-400">{stage.analyst}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-400">
                        <div>{stage.timestamp.toLocaleTimeString()}</div>
                        {stage.duration && (
                          <div className="text-xs">Duration: {stage.duration}</div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 leading-relaxed">{stage.description}</p>

                    {/* Progress Indicator for Active Stages */}
                    {stage.status !== 'resolved' && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${
                              stage.status === 'detected' ? 'bg-red-400' :
                              stage.status === 'investigating' ? 'bg-yellow-400' :
                              'bg-blue-400'
                            }`}
                            initial={{ width: 0 }}
                            whileInView={{ width: '70%' }}
                            transition={{ duration: 2, delay: 0.5 + index * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">In Progress</span>
                      </div>
                    )}
                  </div>
                </TacticalCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex items-center justify-center p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-emerald-400 font-medium">Latest Update: {currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="text-slate-400">•</div>
          <div className="text-slate-300">Average Resolution Time: 28 minutes</div>
          <div className="text-slate-400">•</div>
          <div className="text-slate-300">Success Rate: 99.7%</div>
        </div>
      </motion.div>
    </div>
  );
}