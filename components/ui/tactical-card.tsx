'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '@/styles/design-system/colors';
import { effects } from '@/styles/design-system/effects';

interface TacticalCardProps {
  variant?: 'default' | 'ai' | 'analytics' | 'alert' | 'critical';
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}

const variantStyles = {
  default: {
    border: `1px solid ${colors.border?.subtle || 'rgba(255,255,255,0.08)'}`,
    background: colors.background?.secondary || colors.background?.primary,
    glow: effects.glow?.subtle || 'none',
  },
  ai: {
    border: `1px solid ${colors.ai?.glow || 'rgba(6, 182, 212, 0.3)'}`,
    background: colors.background?.secondary || colors.background?.primary,
    glow: effects.glow?.ai || 'none',
  },
  analytics: {
    border: `1px solid ${colors.status?.operational || 'rgba(16, 185, 129, 0.3)'}`,
    background: colors.background?.secondary || colors.background?.primary,
    glow: effects.glow?.operational || 'none',
  },
  alert: {
    border: `1px solid ${colors.status?.warning || 'rgba(245, 158, 11, 0.3)'}`,
    background: colors.background?.secondary || colors.background?.primary,
    glow: '0 0 20px rgba(245, 158, 11, 0.2)',
  },
  critical: {
    border: `1px solid ${colors.border?.critical || colors.status?.critical || '#EF4444'}`,
    background: colors.background?.secondary || colors.background?.primary,
    glow: effects.glow?.critical || 'none',
  },
};

export function TacticalCard({
  variant = 'default',
  children,
  className = '',
  glow = false,
  interactive = false
}: TacticalCardProps) {
  const style = variantStyles[variant];

  return (
    <motion.div
      className={`
        rounded-xl p-6 backdrop-blur-sm
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        border: style.border,
        background: style.background,
        boxShadow: glow ? `${effects.shadow.operational}, ${style.glow}` : effects.shadow.operational,
      }}
      whileHover={interactive ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
