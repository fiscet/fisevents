import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      // ── COLORI DESIGN SYSTEM ─────────────────────────────────
      colors: {
        // Brand primario — Warm Coral
        'fe-primary': 'hsl(var(--fe-primary))',
        'fe-primary-container': 'hsl(var(--fe-primary-container))',
        'fe-on-primary': 'hsl(var(--fe-on-primary))',
        'fe-on-primary-container': 'hsl(var(--fe-on-primary-container))',
        'fe-primary-fixed': 'hsl(var(--fe-primary-fixed))',
        'fe-primary-fixed-dim': 'hsl(var(--fe-primary-fixed-dim))',
        'fe-inverse-primary': 'hsl(var(--fe-inverse-primary))',

        // Brand secondario — Soft Teal
        'fe-secondary': 'hsl(var(--fe-secondary))',
        'fe-secondary-container': 'hsl(var(--fe-secondary-container))',
        'fe-on-secondary': 'hsl(var(--fe-on-secondary))',
        'fe-on-secondary-container': 'hsl(var(--fe-on-secondary-container))',
        'fe-secondary-fixed': 'hsl(var(--fe-secondary-fixed))',
        'fe-secondary-fixed-dim': 'hsl(var(--fe-secondary-fixed-dim))',

        // Surface
        'fe-surface': 'hsl(var(--fe-surface))',
        'fe-surface-dim': 'hsl(var(--fe-surface-dim))',
        'fe-surface-bright': 'hsl(var(--fe-surface-bright))',
        'fe-surface-variant': 'hsl(var(--fe-surface-variant))',
        'fe-surface-container-lowest':
          'hsl(var(--fe-surface-container-lowest))',
        'fe-surface-container-low': 'hsl(var(--fe-surface-container-low))',
        'fe-surface-container': 'hsl(var(--fe-surface-container))',
        'fe-surface-container-high': 'hsl(var(--fe-surface-container-high))',
        'fe-surface-container-highest':
          'hsl(var(--fe-surface-container-highest))',

        // Testo
        'fe-on-surface': 'hsl(var(--fe-on-surface))',
        'fe-on-surface-variant': 'hsl(var(--fe-on-surface-variant))',
        'fe-on-background': 'hsl(var(--fe-on-background))',

        // Outline
        'fe-outline': 'hsl(var(--fe-outline))',
        'fe-outline-variant': 'hsl(var(--fe-outline-variant))',

        // Inverse
        'fe-inverse-surface': 'hsl(var(--fe-inverse-surface))',
        'fe-inverse-on-surface': 'hsl(var(--fe-inverse-on-surface))',

        // Error
        'fe-error': 'hsl(var(--fe-error))',
        'fe-error-container': 'hsl(var(--fe-error-container))',
        'fe-on-error': 'hsl(var(--fe-on-error))',
        'fe-on-error-container': 'hsl(var(--fe-on-error-container))',

        // ── COMPATIBILITÀ SHADCN/UI ──────────────────────────────
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // ── FONT ─────────────────────────────────────────────────
      fontFamily: {
        headline: ['var(--font-headline)', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        label: ['var(--font-body)', 'Inter', 'sans-serif'],
      },

      // ── BORDER RADIUS ────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      // ── OMBRE ────────────────────────────────────────────────
      boxShadow: {
        editorial: '0 40px 60px -15px rgba(21, 28, 39, 0.06)',
        'editorial-sm': '0 20px 40px -10px rgba(21, 28, 39, 0.05)',
        'editorial-lg': '0 60px 80px -20px rgba(21, 28, 39, 0.08)',
      },

      // ── ANIMAZIONI ───────────────────────────────────────────
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
