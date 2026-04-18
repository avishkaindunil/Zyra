import { cn } from '../../lib/utils'
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  SEVERITY_CONFIG,
} from '../../lib/utils'
import { IssueStatus, Priority, Severity } from '../../types'

interface StatusBadgeProps {
  status: IssueStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'badge',
        cfg.bg,
        cfg.color,
        size === 'sm' && 'px-2 py-0.5 text-[10px]'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: Priority
  size?: 'sm' | 'md'
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority]
  return (
    <span
      className={cn(
        'badge border',
        cfg.bg,
        cfg.color,
        cfg.border,
        size === 'sm' && 'px-2 py-0.5 text-[10px]'
      )}
    >
      {cfg.label}
    </span>
  )
}

interface SeverityBadgeProps {
  severity: Severity
  size?: 'sm' | 'md'
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const cfg = SEVERITY_CONFIG[severity]
  return (
    <span
      className={cn(
        'badge',
        cfg.bg,
        cfg.color,
        size === 'sm' && 'px-2 py-0.5 text-[10px]'
      )}
    >
      {cfg.label}
    </span>
  )
}
