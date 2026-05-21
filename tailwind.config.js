/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ── CSS Variable Color References ──
      colors: {
        bg:      'var(--bg)',
        subtle:  'var(--bg-subtle)',
        surface: {
          DEFAULT: 'var(--surface)',
          2:       'var(--surface-2)',
          3:       'var(--surface-3)',
        },
        text: {
          DEFAULT: 'var(--text)',
          2:       'var(--text-2)',
        },
        muted:   'var(--muted)',
        border:  {
          DEFAULT: 'var(--border)',
          soft:    'var(--border-soft)',
          medium:  'var(--border-medium)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft:    'var(--accent-soft)',
          hover:   'var(--accent-hover)',
          fg:      'var(--accent-fg)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft:    'var(--success-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft:    'var(--danger-soft)',
        },
      },

      // ── Typography ──
      fontFamily: {
        sans: ['Geist Variable', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // ── Border Radius (mirrors CSS vars) ──
      borderRadius: {
        'sm':  'var(--radius-sm)',
        'md':  'var(--radius-md)',
        'DEFAULT': 'var(--radius)',
        'lg':  'var(--radius-lg)',
        'xl':  'var(--radius-xl)',
        '2xl': '24px',
        '3xl': '32px',
      },

      // ── Box Shadows ──
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme':    'var(--shadow)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        // Keep a single accent glow — very subtle
        'accent':   '0 0 0 3px var(--accent-soft)',
      },

      // ── Animations ──
      animation: {
        'fade-slide': 'fadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 4s ease-in-out infinite',
      },

      keyframes: {
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },

      // ── Transition Timing ──
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'smooth':     'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring':     'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth-in':  'cubic-bezier(0.4, 0, 1, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
