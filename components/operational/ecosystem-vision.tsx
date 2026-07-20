'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import { TacticalCard } from '@/components/ui/tactical-card';

interface EcosystemItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'beta' | 'planned';
  icon: string;
}

const items: EcosystemItem[] = [
  {
    id: '1',
    name: 'AI SOC',
    description: 'AI-powered security operations center.',
    status: 'active',
    icon: '🧠'
  },
  {
    id: '2',
    name: 'Academy',
    description: 'Cybersecurity training platform.',
    status: 'active',
    icon: '🎓'
  },
  {
    id: '3',
    name: 'Labs',
    description: 'Security simulation environment.',
    status: 'beta',
    icon: '🧪'
  },
  {
    id: '4',
    name: 'Threat Intel',
    description: 'Global threat intelligence network.',
    status: 'active',
    icon: '🔍'
  },
  {
    id: '5',
    name: 'Automation',
    description: 'Security workflow automation.',
    status: 'planned',
    icon: '⚡'
  }
];

const mapStatus = (status: EcosystemItem['status']) => {
  switch (status) {
    case 'active':
      return 'operational';
    case 'beta':
      return 'investigating';
    default:
      return 'investigating';
  }
};

export function EcosystemVision() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white">
          Ecosystem Vision
        </h2>
        <p className="text-slate-400">
          Unified cybersecurity platform
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TacticalCard className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>

                <div>
                  <h3 className="text-white font-semibold">
                    {item.name}
                  </h3>

                  <StatusBadge
                    status={mapStatus(item.status)}
                    size="sm"
                  >
                    {item.status.toUpperCase()}
                  </StatusBadge>
                </div>
              </div>

              <p className="text-sm text-slate-300">
                {item.description}
              </p>
            </TacticalCard>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-slate-400 text-sm">
        SynapseCore Ecosystem
      </div>
    </div>
  );
}