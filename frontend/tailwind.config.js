// tailwind.config.js
// Extend Tailwind agar class-nya selaras dengan CSS tokens kita.
// Dengan ini, kamu bisa pakai: text-primary, bg-surface, shadow-token-md, dsb.

/** @type {import('tailwindcss').Config} */
export default {
  // Aktifkan dark mode via class (kita kontrol manual lewat Vue/Pinia)
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {

      // ── Font Family ─────────────────────────────────────
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },

      // ── Colors (pakai CSS var agar otomatis ikut dark mode) ──
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        secondary: {
          50:  'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
        },
        neutral: {
          0:   'var(--color-neutral-0)',
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
        // Semantic
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger:  'var(--color-danger)',
        info:    'var(--color-info)',
        // Surface
        surface:   'var(--bg-surface)',
        'surface-2': 'var(--bg-surface-2)',
      },

      // ── Background ────────────────────────────────────────
      backgroundColor: {
        base:      'var(--bg-base)',
        surface:   'var(--bg-surface)',
        'surface-2': 'var(--bg-surface-2)',
      },

      // ── Text Color ────────────────────────────────────────
      textColor: {
        primary:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary:  'var(--text-tertiary)',
        disabled:  'var(--text-disabled)',
        inverse:   'var(--text-inverse)',
        link:      'var(--text-link)',
      },

      // ── Border Color ──────────────────────────────────────
      borderColor: {
        subtle:  'var(--border-subtle)',
        default: 'var(--border-default)',
        strong:  'var(--border-strong)',
        focus:   'var(--border-focus)',
      },

      // ── Border Radius ─────────────────────────────────────
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
      },

      // ── Box Shadow ────────────────────────────────────────
      boxShadow: {
        xs:    'var(--shadow-xs)',
        sm:    'var(--shadow-sm)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        xl:    'var(--shadow-xl)',
        inner: 'var(--shadow-inner)',
      },

      // ── Font Size ─────────────────────────────────────────
      fontSize: {
        xs:   ['var(--text-xs)',   { lineHeight: 'var(--leading-normal)' }],
        sm:   ['var(--text-sm)',   { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg:   ['var(--text-lg)',   { lineHeight: 'var(--leading-snug)'   }],
        xl:   ['var(--text-xl)',   { lineHeight: 'var(--leading-snug)'   }],
        '2xl':['var(--text-2xl)',  { lineHeight: 'var(--leading-tight)'  }],
        '3xl':['var(--text-3xl)',  { lineHeight: 'var(--leading-tight)'  }],
        '4xl':['var(--text-4xl)',  { lineHeight: 'var(--leading-tight)'  }],
      },

      // ── Spacing ───────────────────────────────────────────
      spacing: {
        1:  'var(--space-1)',
        2:  'var(--space-2)',
        3:  'var(--space-3)',
        4:  'var(--space-4)',
        5:  'var(--space-5)',
        6:  'var(--space-6)',
        8:  'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
      },

      // ── Transition ────────────────────────────────────────
      transitionDuration: {
        fast:   'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow:   'var(--duration-slow)',
      },
      transitionTimingFunction: {
        default: 'var(--ease-default)',
        in:      'var(--ease-in)',
        out:     'var(--ease-out)',
      },

      // ── Z-Index ───────────────────────────────────────────
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky:   'var(--z-sticky)',
        overlay:  'var(--z-overlay)',
        modal:    'var(--z-modal)',
        toast:    'var(--z-toast)',
        tooltip:  'var(--z-tooltip)',
      },
    },
  },

  plugins: [],
}
