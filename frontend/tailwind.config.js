/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#080B12',
          primary: '#0F1320',
          elevated: '#161B2E',
          hover: '#1E2438',
        },
        border: {
          DEFAULT: '#252D42',
          strong: '#2E3854',
        },
        accent: {
          DEFAULT: '#7C5FE6',
          hover: '#8D72F0',
          light: 'rgba(124,95,230,0.15)',
          lighter: 'rgba(124,95,230,0.08)',
        },
        status: {
          open: '#3B82F6',
          'open-bg': 'rgba(59,130,246,0.12)',
          'in-progress': '#F59E0B',
          'in-progress-bg': 'rgba(245,158,11,0.12)',
          resolved: '#10B981',
          'resolved-bg': 'rgba(16,185,129,0.12)',
          closed: '#6B7280',
          'closed-bg': 'rgba(107,114,128,0.12)',
        },
        priority: {
          low: '#22C55E',
          'low-bg': 'rgba(34,197,94,0.12)',
          medium: '#3B82F6',
          'medium-bg': 'rgba(59,130,246,0.12)',
          high: '#F59E0B',
          'high-bg': 'rgba(245,158,11,0.12)',
          critical: '#EF4444',
          'critical-bg': 'rgba(239,68,68,0.12)',
        },
        content: {
          primary: '#E8ECFF',
          secondary: '#7E89A9',
          muted: '#4A5470',
          inverse: '#080B12',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(124,95,230,0.25)',
        'glow-sm': '0 0 10px rgba(124,95,230,0.15)',
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
        modal: '0 25px 50px rgba(0,0,0,0.7)',
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
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(124,95,230,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59,130,246,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(124,95,230,0.06) 0px, transparent 50%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
