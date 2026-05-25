// Tokens sourced directly from DESIGN.md (Apple design system via getdesign)
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Colors ──────────────────────────────────────────────────────────
      colors: {
        // Brand / interactive
        primary:           '#0066cc',
        'primary-focus':   '#0071e3',
        'primary-on-dark': '#2997ff',

        // Surfaces
        canvas:           '#ffffff',
        'canvas-parchment': '#f5f5f7',
        'surface-pearl':  '#fafafc',
        'surface-tile-1': '#272729',
        'surface-tile-2': '#2a2a2c',
        'surface-tile-3': '#252527',
        'surface-black':  '#000000',
        'surface-chip':   '#d2d2d7',

        // Text
        ink:              '#1d1d1f',
        'ink-80':         '#333333',
        'ink-48':         '#7a7a7a',
        'body-muted':     '#cccccc',

        // Borders
        'divider-soft':   '#f0f0f0',
        hairline:         '#e0e0e0',
      },

      // ─── Font family ─────────────────────────────────────────────────────
      fontFamily: {
        display: [
          'SF Pro Display', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Helvetica Neue', 'Arial', 'sans-serif',
        ],
        body: [
          'SF Pro Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Helvetica Neue', 'Arial', 'sans-serif',
        ],
        sans: [
          'SF Pro Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Helvetica Neue', 'Arial', 'sans-serif',
        ],
      },

      // ─── Typography scale (from DESIGN.md) ───────────────────────────────
      fontSize: {
        'hero-display': ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        'display-lg':   ['40px', { lineHeight: '1.10', letterSpacing: '0px',     fontWeight: '600' }],
        'display-md':   ['34px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '600' }],
        'lead':         ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
        'lead-airy':    ['24px', { lineHeight: '1.5',  letterSpacing: '0px',     fontWeight: '300' }],
        'tagline':      ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'body-strong':  ['17px', { lineHeight: '1.24', letterSpacing: '-0.374px', fontWeight: '600' }],
        'body':         ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
        'dense-link':   ['17px', { lineHeight: '2.41', letterSpacing: '0px',     fontWeight: '400' }],
        'caption':      ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px', fontWeight: '400' }],
        'caption-strong': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '600' }],
        'btn-large':    ['18px', { lineHeight: '1.0',  letterSpacing: '0px',     fontWeight: '300' }],
        'btn-utility':  ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '400' }],
        'fine-print':   ['12px', { lineHeight: '1.0',  letterSpacing: '-0.12px', fontWeight: '400' }],
        'micro-legal':  ['10px', { lineHeight: '1.3',  letterSpacing: '-0.08px', fontWeight: '400' }],
        'nav-link':     ['12px', { lineHeight: '1.0',  letterSpacing: '-0.12px', fontWeight: '400' }],
      },

      // ─── Border radius (from DESIGN.md rounded tokens) ───────────────────
      borderRadius: {
        none: '0px',
        xs:   '5px',
        sm:   '8px',
        md:   '11px',
        lg:   '18px',
        pill: '9999px',
        full: '9999px',
      },

      // ─── Spacing (from DESIGN.md spacing tokens) ──────────────────────────
      spacing: {
        xxs:     '4px',
        xs:      '8px',
        sm:      '12px',
        md:      '17px',
        lg:      '24px',
        xl:      '32px',
        xxl:     '48px',
        section: '80px',
      },

      // ─── Animations ───────────────────────────────────────────────────────
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':    'fadeIn 0.5s ease both',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        'product': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0',  // the ONE shadow Apple uses
        'hairline': '0 0 0 1px rgba(0, 0, 0, 0.08)',
      },

      // ─── Backdrop blur ────────────────────────────────────────────────────
      backdropBlur: {
        apple: '20px',
      },

      // ─── Max widths ───────────────────────────────────────────────────────
      maxWidth: {
        'apple':  '980px',
        'store':  '1440px',
        'narrow': '720px',
      },
    },
  },
  plugins: [],
}

export default config
