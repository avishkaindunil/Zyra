import { Issue } from '../../types'
import { IssueRow } from './IssueRow'
import { IssueRowSkeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { ListX } from 'lucide-react'

interface IssueTableProps {
  issues: Issue[]
  isLoading: boolean
  onEdit: (issue: Issue) => void
  onDelete: (issue: Issue) => void
  onStatusChange: (issue: Issue, status: Issue['status']) => void
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export function IssueTable({
  issues,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  hasActiveFilters,
  onClearFilters,
}: IssueTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-surface-primary/50">
            <th className="text-left px-5 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">
              Issue
            </th>
            <th className="text-left px-3 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-3 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider">
              Priority
            </th>
            <th className="text-left px-3 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider hidden lg:table-cell">
              Severity
            </th>
            <th className="text-left px-3 py-3 text-[11px] font-semibold text-content-muted uppercase tracking-wider hidden xl:table-cell">
              Reporter
            </th>
            <th className="px-3 py-3" />
          </tr>
        </thead>
        <tbody className="relative">
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6}>
                    <IssueRowSkeleton />
                  </td>
                </tr>
              ))}
            </>
          ) : issues.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={ListX}
                  title={hasActiveFilters ? 'No matching issues' : 'No issues yet'}
                  description={
                    hasActiveFilters
                      ? 'Try adjusting your filters to find what you\'re looking for.'
                      : 'Create your first issue to get started tracking bugs and tasks.'
                  }
                  action={
                    hasActiveFilters && onClearFilters ? (
                      <button onClick={onClearFilters} className="btn-secondary">
                        Clear Filters
                      </button>
                    ) : undefined
                  }
                />
              </td>
            </tr>
          ) : (
            issues.map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
