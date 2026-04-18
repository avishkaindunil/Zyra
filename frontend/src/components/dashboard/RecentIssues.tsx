import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Issue } from '../../types'
import { StatusBadge, PriorityBadge } from '../ui/Badge'
import { formatRelativeTime, truncate } from '../../lib/utils'
import { Skeleton } from '../ui/Skeleton'

interface RecentIssuesProps {
  issues: Issue[]
  isLoading: boolean
}

export function RecentIssues({ issues, isLoading }: RecentIssuesProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-content-primary">Recent Issues</h2>
        <Link to="/issues" className="btn-ghost text-xs gap-1.5">
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="flex-1 h-4 rounded" />
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="px-5 py-10 text-center text-content-muted text-sm">
          No issues yet.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover/50 transition-colors group"
            >
              <div className="w-2 h-2 rounded-full bg-status-open shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-content-primary group-hover:text-accent transition-colors truncate">
                  {truncate(issue.title, 60)}
                </p>
                <p className="text-xs text-content-muted mt-0.5">
                  by {issue.user.name} · {formatRelativeTime(issue.createdAt)}
                </p>
              </div>
              <StatusBadge status={issue.status} size="sm" />
              <PriorityBadge priority={issue.priority} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
