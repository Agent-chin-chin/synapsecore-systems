'use client';

import { useEffect } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const typeStyles = {
    success: 'bg-emerald-600 text-white border-emerald-500',
    error: 'bg-red-600 text-white border-red-500',
    info: 'bg-cyan-600 text-white border-cyan-500',
    warning: 'bg-amber-600 text-white border-amber-500'
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  return (
    <div
      className={`animate-in fade-in slide-in-from-top-2 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${typeStyles[type]}`}
    >
      <span className="text-lg font-bold flex-shrink-0">{typeIcons[type]}</span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-2 flex-shrink-0 text-lg hover:opacity-80 transition"
      >
        ✕
      </button>
    </div>
  );
}
