/* Design System - Color Tokens */
export const colors = {
  /* Base Colors */
  background: {
    primary: '#000000',        // Pure black for maximum contrast
    secondary: '#0F1117',      // Very dark gray-near-black
    tertiary: '#1A1F2E',       // Dark slate-900
    overlay: 'rgba(0, 0, 0, 0.95)',  // Near-opaque black overlay
  },

  /* Operational Status Colors */
  status: {
    operational: '#10B981', // emerald-500
    warning: '#F59E0B',    // amber-500
    critical: '#EF4444',   // red-500
    investigating: '#3B82F6', // blue-500
    resolved: '#6B7280',   // gray-500
    offline: '#374151',    // gray-700
  },

  /* AI Intelligence Colors */
  ai: {
    primary: '#64748B',        // Slate-600 - enterprise neutral
    secondary: '#475569',      // Slate-700 - deeper accent
    accent: '#94A3B8',         // Slate-400 - lighter accent
    glow: 'rgba(100, 116, 139, 0.15)',  // Subtle slate glow
  },

  /* Tactical Gradients */
  gradients: {
    cyber: 'linear-gradient(135deg, #64748B 0%, #475569 50%, #334155 100%)',  // Slate gradient
    threat: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',  // Red-Amber (unchanged - for alerts)
    operational: 'linear-gradient(135deg, #10B981 0%, #64748B 100%)',  // Green-Slate
    dark: 'linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 17, 23, 0.95) 100%)',  // Pure black gradient
  },

  /* Text Colors */
  text: {
    primary: '#FFFFFF',        // Pure white - maximum contrast
    secondary: '#E5E7EB',      // Light gray - high contrast
    tertiary: '#A0AEC0',       // Slate-400 - readable on dark backgrounds
    muted: '#78828F',          // Slate-500 - less prominent but still readable
    accent: '#64748B',         // Slate-600 - safer than cyan
  },

  /* Border Colors */
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',      // Very subtle
    medium: 'rgba(255, 255, 255, 0.12)',      // Barely visible
    strong: 'rgba(100, 116, 139, 0.25)',      // Slate border (was cyan - too bright)
    critical: 'rgba(239, 68, 68, 0.3)',       // Red for critical (unchanged)
  },
} as const;