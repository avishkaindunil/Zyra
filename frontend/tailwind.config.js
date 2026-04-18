/** @type {import('tailwindcss').Config} */
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: withOpacity('--surface-base'),
          primary: withOpacity('--surface-primary'),
          elevated: withOpacity('--surface-elevated'),
          hover: withOpacity('--surface-hover'),
        },
        border: {
          DEFAULT: withOpacity('--border'),
          strong: withOpacity('--border-strong'),
        },
        accent: {
          DEFAULT: withOpacity('--accent'),
          hover: withOpacity('--accent-hover'),
          light: 'rgb(var(--accent) / 0.15)',
          lighter: 'rgb(var(--accent) / 0.08)',
        },
        status: {
          open: withOpacity('--status-open'),
          'open-bg': 'rgb(var(--status-open) / 0.12)',
          'in-progress': withOpacity('--status-in-progress'),
          'in-progress-bg': 'rgb(var(--status-in-progress) / 0.12)',
          resolved: withOpacity('--status-resolved'),
          'resolved-bg': 'rgb(var(--status-resolved) / 0.12)',
          closed: withOpacity('--status-closed'),
          'closed-bg': 'rgb(var(--status-closed) / 0.12)',
        },
        priority: {
          low: withOpacity('--priority-low'),
          'low-bg': 'rgb(var(--priority-low) / 0.12)',
          medium: withOpacity('--priority-medium'),
          'medium-bg': 'rgb(var(--priority-medium) / 0.12)',
          high: withOpacity('--priority-high'),
          'high-bg': 'rgb(var(--priority-high) / 0.12)',
          critical: withOpacity('--priority-critical'),
          'critical-bg': 'rgb(var(--priority-critical) / 0.12)',
        },
        content: {
          primary: withOpacity('--content-primary'),
          secondary: withOpacity('--content-secondary'),
          muted: withOpacity('--content-muted'),
          inverse: withOpacity('--content-inverse'),
        },
        overlay: withOpacity('--overlay'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgb(var(--accent) / 0.25)',
        'glow-sm': '0 0 10px rgb(var(--accent) / 0.18)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        modal: 'var(--shadow-modal)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgb(var(--mesh-accent) / 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(var(--mesh-secondary) / 0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(var(--mesh-tertiary) / 0.10) 0px, transparent 50%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgb(var(--shimmer-highlight) / 0.16) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
