import { IssueStats } from '../../types'
import { PRIORITY_CONFIG } from '../../lib/utils'
import { Priority } from '../../types'
import { Skeleton } from '../ui/Skeleton'

interface PriorityChartProps {
  stats: IssueStats | null
  isLoading: boolean
}

const PRIORITY_ORDER: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export function PriorityChart({ stats, isLoading }: PriorityChartProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-5">
        <Skeleton className="h-4 w-32 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-16 h-3 rounded" />
              <Skeleton className="flex-1 h-2 rounded-full" />
              <Skeleton className="w-6 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const total = stats?.total || 0

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-content-primary">By Priority</h2>
        <p className="text-xs text-content-muted mt-0.5">Distribution across all issues</p>
      </div>
      <div className="px-5 py-5 space-y-4">
        {PRIORITY_ORDER.map((priority) => {
          const count = stats?.byPriority[priority] || 0
          const pct = total > 0 ? (count / total) * 100 : 0
          const cfg = PRIORITY_CONFIG[priority]

          return (
            <div key={priority} className="flex items-center gap-3">
              <span className={`text-xs font-semibold w-16 shrink-0 ${cfg.color}`}>
                {cfg.label}
              </span>
              <div className="flex-1 bg-surface-base rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${cfg.bg}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-content-muted w-8 text-right tabular-nums">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
