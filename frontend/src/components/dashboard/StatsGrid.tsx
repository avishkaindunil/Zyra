import { TrendingUp, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { IssueStats } from '../../types'
import { StatCardSkeleton } from '../ui/Skeleton'

interface StatsGridProps {
  stats: IssueStats | null
  isLoading: boolean
}

const STAT_CARDS = [
  {
    key: 'total' as const,
    label: 'Total Issues',
    icon: TrendingUp,
    accent: 'text-accent',
    bg: 'bg-accent-lighter',
    border: 'border-accent/20',
  },
  {
    key: 'open' as const,
    label: 'Open',
    icon: AlertCircle,
    accent: 'text-status-open',
    bg: 'bg-status-open-bg',
    border: 'border-status-open/20',
  },
  {
    key: 'in_progress' as const,
    label: 'In Progress',
    icon: Clock,
    accent: 'text-status-in-progress',
    bg: 'bg-status-in-progress-bg',
    border: 'border-status-in-progress/20',
  },
  {
    key: 'resolved' as const,
    label: 'Resolved',
    icon: CheckCircle2,
    accent: 'text-status-resolved',
    bg: 'bg-status-resolved-bg',
    border: 'border-status-resolved/20',
  },
  {
    key: 'closed' as const,
    label: 'Closed',
    icon: XCircle,
    accent: 'text-status-closed',
    bg: 'bg-status-closed-bg',
    border: 'border-status-closed/20',
  },
]

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map((s) => <StatCardSkeleton key={s.key} />)}
      </div>
    )
  }

  const getValue = (key: string): number => {
    if (!stats) return 0
    if (key === 'total') return stats.total
    if (key === 'open') return stats.byStatus.OPEN
    if (key === 'in_progress') return stats.byStatus.IN_PROGRESS
    if (key === 'resolved') return stats.byStatus.RESOLVED
    if (key === 'closed') return stats.byStatus.CLOSED
    return 0
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {STAT_CARDS.map(({ key, label, icon: Icon, accent, bg, border }) => {
        const value = getValue(key)
        const pct = stats?.total ? Math.round((value / stats.total) * 100) : 0

        return (
          <div
            key={key}
            className={`stat-card border ${border} group hover:border-opacity-40 transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon size={16} className={accent} />
              </div>
              {key !== 'total' && stats?.total ? (
                <span className="text-[10px] font-mono text-content-muted">
                  {pct}%
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-content-primary tabular-nums">
                {value}
              </p>
              <p className="text-xs text-content-muted font-medium mt-0.5">{label}</p>
            </div>
            {key !== 'total' && stats?.total ? (
              <div className="w-full bg-surface-base rounded-full h-1 overflow-hidden">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${bg.replace('bg-', 'bg-').replace('-bg', '')}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
