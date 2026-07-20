'use client';

import React, { useEffect, useState } from 'react';
import { colors } from '@/styles/design-system/colors';
import { effects } from '@/styles/design-system/effects';
import { typography } from '@/styles/design-system/typography';

interface MetricCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  variant?: 'default' | 'ai' | 'operational' | 'critical';
}

const variantStyles = {
  default: {
    color: colors.text?.primary || '#FFFFFF',
    glow: 'none',
  },
  ai: {
    color: colors.ai?.primary || '#64748B',
    glow: '0 0 20px rgba(100, 116, 139, 0.3)',
  },
  operational: {
    color: colors.status?.operational || '#10B981',
    glow: effects.glow?.operational || '0 0 20px rgba(16, 185, 129, 0.2)',
  },
  critical: {
    color: colors.status?.critical || '#EF4444',
    glow: effects.glow?.critical || '0 0 20px rgba(239, 68, 68, 0.2)',
  },
};

export function MetricCounter({
  value,
  label,
  suffix = '',
  prefix = '',
  duration = 2000,
  variant = 'default'
}: MetricCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const style = variantStyles[variant];

  useEffect(() => {
    const startValue = 0;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <div className="text-center">
      <div
        className="text-4xl font-bold mb-2 transition-all duration-300"
        style={{
          color: style.color,
          textShadow: style.glow,
          fontSize: typography.fontSize['4xl'],
          fontWeight: typography.fontWeight.bold,
        }}
      >
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div
        className="text-sm uppercase tracking-wider font-medium"
        style={{
          color: colors.text?.tertiary || '#A0AEC0',
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          letterSpacing: typography.letterSpacing.wider,
        }}
      >
        {label}
      </div>
    </div>
  );
}