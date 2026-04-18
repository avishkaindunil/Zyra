import { Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTheme } from './ThemeProvider'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'group inline-flex rounded-full transition-transform duration-200 hover:scale-[1.00] active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-surface-base',
        className
      )}
    >
      <span
        className={cn(
          'relative flex h-9 w-[73px] items-center rounded-full border p-1 shadow-card transition-all duration-300',
          isDark
            ? 'border-white/10 bg-gradient-to-r from-[#0f1424] via-[#171d31] to-[#0a0f1d]'
            : 'border-slate-300/90 bg-gradient-to-r from-[#f8fafc] via-[#eef2f7] to-[#dde5ef]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute left-1 top-1 z-10 h-7 w-7 rounded-full transition-all duration-300 ease-out',
            isDark
              ? 'translate-x-[36px] bg-gradient-to-b from-[#3d4457] to-[#111827] shadow-[0_8px_18px_rgba(15,23,42,0.45)]'
              : 'translate-x-0 bg-gradient-to-b from-white to-[#eef2f7] shadow-[0_8px_18px_rgba(148,163,184,0.35)]'
          )}
        />

        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
          <Sun
            size={14}
            className={cn(
              'transition-all duration-300',
              isDark ? 'text-content-muted/70' : 'text-[#f59e0b]'
            )}
          />
        </span>

        <span className="absolute inset-y-0 right-0 flex items-center pr-2.5">
          <Moon
            size={14}
            className={cn(
              'transition-all duration-300',
              isDark ? 'text-white' : 'text-slate-500'
            )}
          />
        </span>
      </span>
    </button>
  )
}
