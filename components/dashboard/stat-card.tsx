'use client';

import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  link?: string;
  onClick?: () => void;
}

interface StatsCardGroupProps {
  title: string;
  cards?: StatCardProps[];
  children?: ReactNode;
}

const colorStyles: Record<StatCardProps['color'], { icon: string; bg: string }> = {
  red: { icon: 'text-red-500', bg: 'bg-red-500/10' },
  orange: { icon: 'text-orange-500', bg: 'bg-orange-500/10' },
  green: { icon: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  blue: { icon: 'text-sky-500', bg: 'bg-sky-500/10' },
  purple: { icon: 'text-violet-500', bg: 'bg-violet-500/10' },
  gray: { icon: 'text-slate-500', bg: 'bg-slate-500/10' },
};

export function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  link,
  onClick,
}: StatCardProps) {
  const styles = colorStyles[color] ?? colorStyles.gray;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <div
      className="group cursor-pointer rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-500"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${styles.bg}`}>
          <span className={`text-2xl ${styles.icon}`}>{icon}</span>
        </div>
        {trend && (
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
            {trend.isPositive ? '?' : '?'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </div>

      {link && (
        <div className="mt-6 text-sm font-medium text-cyan-400 transition group-hover:text-cyan-300">
          View Details ?
        </div>
      )}
    </div>
  );
}

export function StatsCardGroup({ title, cards, children }: StatsCardGroupProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">Quick access to your most important metrics.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {children ?? cards?.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
