/* Design System - Spacing Scale */
export const spacing = {
  /* Base Spacing Units */
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px

  /* Section Spacing */
  section: {
    sm: '3rem',     // 48px
    md: '4rem',     // 64px
    lg: '6rem',     // 96px
    xl: '8rem',     // 128px
  },

  /* Component Spacing */
  component: {
    padding: {
      sm: '1rem',   // 16px
      md: '1.5rem', // 24px
      lg: '2rem',   // 32px
    },
    gap: {
      sm: '0.75rem', // 12px
      md: '1rem',    // 16px
      lg: '1.5rem',  // 24px
    },
  },
} as const;