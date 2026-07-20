/* Design System - Glow & Shadow System */
export const effects = {
  /* Glow Effects */
  glow: {
    subtle: '0 0 20px rgba(100, 116, 139, 0.08)',     // Slate subtle glow
    medium: '0 0 30px rgba(100, 116, 139, 0.12)',     // Slate medium glow
    strong: '0 0 40px rgba(100, 116, 139, 0.15)',     // Slate strong glow
    critical: '0 0 30px rgba(239, 68, 68, 0.3)',      // Red critical (unchanged)
    operational: '0 0 25px rgba(16, 185, 129, 0.15)', // Green operational (reduced)
    ai: '0 0 35px rgba(100, 116, 139, 0.12)',         // Slate AI glow (was cyan)
  },

  /* Box Shadows */
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    operational: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    cyber: '0 0 50px rgba(100, 116, 139, 0.08), 0 0 100px rgba(100, 116, 139, 0.04)',  // Slate instead of cyan
  },

  /* Border Radius */
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    full: '9999px',
  },

  /* Transitions */
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  /* Animations */
  animation: {
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    ping: 'ping 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
    spin: 'spin 1s linear infinite',
    bounce: 'bounce 1s infinite',
  },
} as const;