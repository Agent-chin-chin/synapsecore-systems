'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TacticalCard } from '@/components/ui/tactical-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { colors } from '@/styles/design-system';

interface AIInsight {
  id: string;
  type: 'analysis' | 'prediction' | 'recommendation';
  title: string;
  content: string;
  confidence: number;
  timestamp: Date;
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'analysis',
    title: 'Anomaly Detected',
    content: 'AI detected abnormal authentication activity from IP 192.168.1.100. Pattern suggests credential stuffing attempt.',
    confidence: 98.7,
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '2',
    type: 'prediction',
    title: 'Severity Prediction',
    content: 'Based on threat intelligence, this incident has 89% likelihood of being a targeted attack.',
    confidence: 89.2,
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Response Guidance',
    content: 'Recommended: Isolate affected endpoint, initiate forensic analysis, and escalate to SOC lead.',
    confidence: 94.1,
    timestamp: new Date(Date.now() - 300000)
  }
];

const getTypeColor = (type: AIInsight['type']) => {
  switch (type) {
    case 'analysis': return 'cyan';
    case 'prediction': return 'yellow';
    case 'recommendation': return 'emerald';
    default: return 'slate';
  }
};

const getTypeIcon = (type: AIInsight['type']) => {
  switch (type) {
    case 'analysis': return '🔍';
    case 'prediction': return '🎯';
    case 'recommendation': return '💡';
    default: return '📊';
  }
};

export function AIIncidentIntelligence() {
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
            className="w-3 h-3 rounded-full bg-cyan-400"
            animate={{ boxShadow: ['0 0 0 0 rgba(34, 211, 238, 0.7)', '0 0 0 10px rgba(34, 211, 238, 0)', '0 0 0 0 rgba(34, 211, 238, 0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm uppercase tracking-wider text-cyan-400 font-semibold">
            AI-Powered Intelligence
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-white"
        >
          Real-Time Threat Analysis & Response Guidance
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          AI continuously analyzes security events, predicts threat severity, and provides actionable response recommendations.
        </motion.p>
      </div>

      {/* AI Insights Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {mockInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <TacticalCard variant="ai" glow className="h-full">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(insight.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status="operational" size="sm">
                          {insight.type.toUpperCase()}
                        </StatusBadge>
                        <span className="text-xs text-slate-400">
                          {insight.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-slate-300 leading-relaxed">{insight.content}</p>

                {/* Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Confidence</span>
                    <span className={`font-semibold ${
                      insight.confidence >= 95 ? 'text-emerald-400' :
                      insight.confidence >= 85 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {insight.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        insight.confidence >= 95 ? 'bg-emerald-400' :
                        insight.confidence >= 85 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${insight.confidence}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </div>
            </TacticalCard>
          </motion.div>
        ))}
      </div>

      {/* Live Processing Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex items-center justify-center p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-3 h-3 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-cyan-400 font-medium">AI processing 1,247 security events per minute</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}