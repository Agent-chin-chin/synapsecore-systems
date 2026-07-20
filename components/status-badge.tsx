'use client';

interface StatusBadgeProps {
  status: 'open' | 'investigating' | 'assigned' | 'resolved' | 'closed' | string;
  variant?: 'pill' | 'square';
}

const statusConfig = {
  open: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    label: 'Open',
  },
  investigating: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    label: 'Investigating',
  },
  assigned: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'Assigned',
  },
  resolved: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    label: 'Resolved',
  },
  closed: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    label: 'Closed',
  },
};

const fallbackConfig = {
  bg: 'bg-slate-100 dark:bg-slate-700/50',
  text: 'text-slate-700 dark:text-slate-300',
  label: 'Unknown',
};

export default function StatusBadge({ status, variant = 'pill' }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] ?? fallbackConfig;
  const borderRadius = variant === 'pill' ? 'rounded-full' : 'rounded-md';
  const padding = variant === 'pill' ? 'px-3 py-1' : 'px-2 py-1';
  const label = config.label || String(status ?? 'Unknown').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span
      className={`inline-flex items-center ${padding} ${borderRadius} text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {label}
    </span>
  );
}
