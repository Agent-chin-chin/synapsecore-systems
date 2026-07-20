/* Design System - Typography Hierarchy */
export const typography = {
  /* Font Families */
  fontFamily: {
    primary: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },

  /* Font Sizes */
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  /* Font Weights */
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  /* Line Heights */
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  /* Letter Spacing */
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  /* Text Styles */
  textStyles: {
    /* Operational UI */
    status: {
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#E5E7EB',  // Light gray - readable
    },
    metric: {
      fontSize: '2rem',
      fontWeight: '700',
      letterSpacing: '-0.025em',
      color: '#FFFFFF',  // White - maximum contrast
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#A0AEC0',  // Slate-400 - readable
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.75',
      color: '#E5E7EB',  // Light gray - readable on dark
    },
    heading: {
      fontSize: '2.25rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      color: '#FFFFFF',  // White heading
    },
  },
} as const;