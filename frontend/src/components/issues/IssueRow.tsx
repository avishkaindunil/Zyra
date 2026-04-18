import { Link } from 'react-router-dom'
import { MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Issue } from '../../types'
import { StatusBadge, PriorityBadge, SeverityBadge } from '../ui/Badge'
import { formatRelativeTime, truncate, getInitials } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface IssueRowProps {
  issue: Issue
  onEdit: (issue: Issue) => void
  onDelete: (issue: Issue) => void
  onStatusChange: (issue: Issue, status: Issue['status']) => void
}

export function IssueRow({ issue, onEdit, onDelete, onStatusChange }: IssueRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isResolvable = issue.status === 'OPEN' || issue.status === 'IN_PROGRESS'

  return (
    <tr className="border-b border-border hover:bg-surface-hover/40 transition-colors group">
      {/* Title */}
      <td className="px-5 py-3.5">
        <Link to={`/issues/${issue.id}`} className="block">
          <p className="text-sm font-medium text-content-primary group-hover:text-accent transition-colors">
            {truncate(issue.title, 65)}
          </p>
          <p className="text-xs text-content-muted mt-0.5">
            #{issue.id.slice(0, 8)} · {formatRelativeTime(issue.createdAt)}
          </p>
        </Link>
      </td>

      {/* Status */}
      <td className="px-3 py-3.5">
        <StatusBadge status={issue.status} />
      </td>

      {/* Priority */}
      <td className="px-3 py-3.5">
        <PriorityBadge priority={issue.priority} />
      </td>

      {/* Severity */}
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <SeverityBadge severity={issue.severity} />
      </td>

      {/* Assignee */}
      <td className="px-3 py-3.5 hidden xl:table-cell">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-light border border-accent/20 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-accent">
              {getInitials(issue.user.name)}
            </span>
          </div>
          <span className="text-xs text-content-secondary truncate max-w-[100px]">
            {issue.user.name}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-1 justify-end" ref={menuRef}>
          <Link
            to={`/issues/${issue.id}`}
            className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            title="View"
          >
            <Eye size={14} />
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              'btn-ghost p-1.5 transition-opacity',
              menuOpen ? 'opacity-100 bg-surface-hover' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <MoreHorizontal size={15} />
          </button>

          {menuOpen && (
            <div className="absolute right-4 mt-1 w-48 bg-surface-elevated border border-border rounded-xl shadow-modal z-20 overflow-hidden animate-slide-down">
              <button
                onClick={() => { onEdit(issue); setMenuOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-content-secondary hover:text-content-primary hover:bg-surface-hover transition-colors"
              >
                <Pencil size={13} />
                Edit Issue
              </button>
              {isResolvable && (
                <button
                  onClick={() => { onStatusChange(issue, 'RESOLVED'); setMenuOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-status-resolved hover:bg-status-resolved-bg transition-colors"
                >
                  <CheckCircle size={13} />
                  Mark Resolved
                </button>
              )}
              {issue.status !== 'CLOSED' && (
                <button
                  onClick={() => { onStatusChange(issue, 'CLOSED'); setMenuOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-status-closed hover:bg-status-closed-bg transition-colors"
                >
                  <XCircle size={13} />
                  Close Issue
                </button>
              )}
              <div className="border-t border-border my-1" />
              <button
                onClick={() => { onDelete(issue); setMenuOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-priority-critical hover:bg-priority-critical-bg transition-colors"
              >
                <Trash2 size={13} />
                Delete Issue
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
