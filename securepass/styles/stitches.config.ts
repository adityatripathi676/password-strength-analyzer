/**
 * Stitches Design System Configuration
 * SecurePass Analyzer — Dark Cybersecurity Theme
 *
 * Everything in this file feeds the entire component library.
 * Modify tokens here to retheme the entire product.
 */

import { createStitches } from '@stitches/react'

export const {
  config,
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      // ── Backgrounds ────────────────────────────────────────────────
      bgBase:       '#07080f',         // page background
      bgElevated:   '#0c0e1a',         // slightly raised surfaces
      bgCard:       'rgba(11, 15, 30, 0.72)', // glassmorphism card
      bgCardHover:  'rgba(16, 22, 42, 0.80)',
      bgInput:      'rgba(255,255,255,0.04)',
      bgInputFocus: 'rgba(34,211,238,0.06)',

      // ── Cyan accent (primary) ──────────────────────────────────────
      cyan400: '#22d3ee',
      cyan500: '#06b6d4',
      cyanDim:  'rgba(34, 211, 238, 0.12)',
      cyanGlow: 'rgba(34, 211, 238, 0.25)',
      cyanBorder: 'rgba(34, 211, 238, 0.30)',

      // ── Purple accent (secondary) ──────────────────────────────────
      purple400: '#a78bfa',
      purple500: '#8b5cf6',
      purpleDim:   'rgba(167, 139, 250, 0.12)',
      purpleGlow:  'rgba(167, 139, 250, 0.25)',
      purpleBorder:'rgba(167, 139, 250, 0.30)',

      // ── Semantic ───────────────────────────────────────────────────
      success:    '#34d399',
      successDim: 'rgba(52, 211, 153, 0.15)',
      successBorder: 'rgba(52, 211, 153, 0.35)',

      warning:    '#fbbf24',
      warningDim: 'rgba(251, 191, 36, 0.15)',
      warningBorder: 'rgba(251, 191, 36, 0.35)',

      danger:    '#f87171',
      dangerDim: 'rgba(248, 113, 113, 0.15)',
      dangerBorder: 'rgba(248, 113, 113, 0.35)',

      // ── Text ───────────────────────────────────────────────────────
      textPrimary:   '#f1f5f9',
      textSecondary: '#94a3b8',
      textMuted:     '#4b5680',
      textDisabled:  '#2d3748',

      // ── Borders ────────────────────────────────────────────────────
      border:       'rgba(255, 255, 255, 0.07)',
      borderSubtle: 'rgba(255, 255, 255, 0.04)',
    },

    fonts: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace",
    },

    fontSizes: {
      '2xs': '0.65rem',
      xs:   '0.75rem',
      sm:   '0.875rem',
      base: '1rem',
      lg:   '1.125rem',
      xl:   '1.25rem',
      '2xl':'1.5rem',
      '3xl':'1.875rem',
      '4xl':'2.25rem',
      '5xl':'3rem',
      '6xl':'3.75rem',
      '7xl':'4.5rem',
    },

    fontWeights: {
      light:    '300',
      regular:  '400',
      medium:   '500',
      semibold: '600',
      bold:     '700',
      extrabold:'800',
    },

    lineHeights: {
      tight:  '1.2',
      snug:   '1.375',
      normal: '1.5',
      relaxed:'1.625',
    },

    space: {
      px: '1px',
      0:  '0',
      1:  '4px',   2: '8px',   3: '12px',  4: '16px',  5: '20px',
      6:  '24px',  7: '28px',  8: '32px',  9: '36px', 10: '40px',
      11: '44px', 12: '48px', 14: '56px', 16: '64px', 18: '72px',
      20: '80px', 24: '96px', 28: '112px',32: '128px',36: '144px',
    },

    sizes: {
      full: '100%',
      screen: '100vw',
      screenH: '100vh',
      content: '1200px',
      'content-sm': '900px',
      'content-xs': '640px',
    },

    radii: {
      none:   '0',
      sm:     '6px',
      md:     '10px',
      lg:     '14px',
      xl:     '20px',
      '2xl':  '28px',
      full:   '9999px',
    },

    shadows: {
      card:       '0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset',
      cardHover:  '0 8px 48px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.07) inset',
      cyanGlow:   '0 0 32px rgba(34, 211, 238, 0.18)',
      purpleGlow: '0 0 32px rgba(167, 139, 250, 0.18)',
      sm:         '0 2px 8px rgba(0,0,0,0.4)',
      inner:      'inset 0 1px 2px rgba(0,0,0,0.5)',
    },

    zIndices: {
      base:    '0',
      raised:  '10',
      sticky:  '100',
      overlay: '200',
      modal:   '300',
      toast:   '400',
    },

    transitions: {
      fast:   'all 0.15s ease',
      normal: 'all 0.25s ease',
      slow:   'all 0.4s ease',
    },
  },

  media: {
    sm:  '(min-width: 640px)',
    md:  '(min-width: 768px)',
    lg:  '(min-width: 1024px)',
    xl:  '(min-width: 1280px)',
    '2xl':'(min-width: 1536px)',
  },

  utils: {
    // Padding shortcuts
    p:  (v: string) => ({ padding: v }),
    pt: (v: string) => ({ paddingTop: v }),
    pb: (v: string) => ({ paddingBottom: v }),
    pl: (v: string) => ({ paddingLeft: v }),
    pr: (v: string) => ({ paddingRight: v }),
    px: (v: string) => ({ paddingLeft: v, paddingRight: v }),
    py: (v: string) => ({ paddingTop: v, paddingBottom: v }),
    // Margin shortcuts
    m:  (v: string) => ({ margin: v }),
    mt: (v: string) => ({ marginTop: v }),
    mb: (v: string) => ({ marginBottom: v }),
    mx: (v: string) => ({ marginLeft: v, marginRight: v }),
    my: (v: string) => ({ marginTop: v, marginBottom: v }),
    // Size shortcuts
    size:   (v: string) => ({ width: v, height: v }),
    maxW:   (v: string) => ({ maxWidth: v }),
    minH:   (v: string) => ({ minHeight: v }),
    // Layout helpers
    flexCenter: (_: boolean) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    flexBetween:(_: boolean) => ({ display: 'flex', alignItems: 'center', justifyContent:'space-between' }),
    // Visual
    glass: (_: boolean) => ({
      background: 'rgba(11, 15, 30, 0.72)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }),
  },
})

// ── Global keyframes ──────────────────────────────────────────────────────────
export const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to:   { opacity: 1, transform: 'translateY(0)' },
})

export const fadeIn = keyframes({
  from: { opacity: 0 },
  to:   { opacity: 1 },
})

export const shimmer = keyframes({
  '0%':   { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
})

export const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%':      { opacity: 0.5 },
})

export const float = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%':      { transform: 'translateY(-8px)' },
})

export const scanLine = keyframes({
  '0%':   { transform: 'translateY(-100%)' },
  '100%': { transform: 'translateY(100vh)' },
})

// ── Global styles ─────────────────────────────────────────────────────────────
export const applyGlobalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  html: {
    scrollBehavior: 'smooth',
    fontSize: '16px',
  },
  body: {
    fontFamily: '$sans',
    background: '$bgBase',
    color: '$textPrimary',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  'a': {
    color: 'inherit',
    textDecoration: 'none',
  },
  '::-webkit-scrollbar': {
    width: '6px',
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
  },
  '::selection': {
    background: 'rgba(34,211,238,0.25)',
    color: '$textPrimary',
  },
})
