import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Download, RefreshCw } from 'lucide-react'
import { useIssueStore } from '../store/issueStore'
import { Issue, IssueFilters } from '../types'
import { IssueFiltersBar } from '../components/issues/IssueFiltersBar'
import { IssueTable } from '../components/issues/IssueTable'
import { IssueFormModal } from '../components/issues/IssueFormModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { useToastContext } from '../components/ui/ToastProvider'
import { useDebounce } from '../hooks/useDebounce'
import { IssueFormData } from '../lib/schemas'
import { ThemeToggle } from '../components/ui/ThemeToggle'

export function IssuesPage() {
  const {
    issues,
    meta,
    filters,
    isLoading,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    setFilters,
    resetFilters,
    exportIssues,
  } = useIssueStore()

  const { toast } = useToastContext()
  const [searchParams] = useSearchParams()

  const [formOpen, setFormOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Issue | null>(null)
  const [statusTarget, setStatusTarget] = useState<{ issue: Issue; status: Issue['status'] } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const debouncedSearch = useDebounce(filters.search, 400)

  useEffect(() => {
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    if (status || priority) {
      setFilters({
        status: (status as IssueFilters['status']) || '',
        priority: (priority as IssueFilters['priority']) || '',
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchIssues()
  }, [
    debouncedSearch,
    filters.status,
    filters.priority,
    filters.severity,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit,
  ]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = useCallback(
    (newFilters: Partial<IssueFilters>) => {
      setFilters(newFilters)
    },
    [setFilters]
  )

  const handleCreate = () => {
    setEditingIssue(null)
    setFormOpen(true)
  }

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: IssueFormData) => {
    setIsSubmitting(true)
    try {
      if (editingIssue) {
        await updateIssue(editingIssue.id, data)
        toast('Issue updated successfully', 'success')
      } else {
        await createIssue(data)
        toast('Issue created successfully', 'success')
      }
      setFormOpen(false)
      setEditingIssue(null)
    } catch {
      toast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteIssue(deleteTarget.id)
      toast('Issue deleted', 'success')
      setDeleteTarget(null)
    } catch {
      toast('Failed to delete issue', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChangeConfirm = async () => {
    if (!statusTarget) return
    try {
      await updateIssue(statusTarget.issue.id, { status: statusTarget.status })
      toast(
        `Issue marked as ${statusTarget.status === 'RESOLVED' ? 'resolved' : 'closed'}`,
        'success'
      )
      setStatusTarget(null)
    } catch {
      toast('Failed to update status', 'error')
    }
  }

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true)
    try {
      await exportIssues(format)
      toast(`Exported as ${format.toUpperCase()}`, 'success')
    } catch {
      toast('Export failed', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const hasActiveFilters = !!(filters.search || filters.status || filters.priority || filters.severity)

  return (
    <div className="space-y-5 p-6 page-enter">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-content-primary">Issues</h1>
          <p className="mt-0.5 text-sm text-content-secondary">
            {meta ? `${meta.total} issue${meta.total !== 1 ? 's' : ''} total` : 'Manage and track all issues'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <div className="relative group">
            <button className="btn-secondary gap-2" disabled={isExporting}>
              <Download size={15} />
              Export
            </button>
            <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-modal invisible opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 animate-slide-down">
              <button
                onClick={() => handleExport('csv')}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-content-secondary hover:bg-surface-hover hover:text-content-primary"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-content-secondary hover:bg-surface-hover hover:text-content-primary"
              >
                Export JSON
              </button>
            </div>
          </div>

          <button onClick={() => fetchIssues()} className="btn-ghost p-2.5" title="Refresh">
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button onClick={handleCreate} className="btn-primary">
            <Plus size={16} />
            New Issue
          </button>
        </div>
      </div>

      <IssueFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      <div className="glass-card overflow-hidden">
        <IssueTable
          issues={issues}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          onStatusChange={(issue, status) => setStatusTarget({ issue, status })}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={resetFilters}
        />
        {meta && meta.totalPages > 1 && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={(p) => setFilters({ page: p })}
          />
        )}
      </div>

      <IssueFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingIssue(null)
        }}
        onSubmit={handleFormSubmit}
        issue={editingIssue}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Issue"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Issue"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!statusTarget}
        title={statusTarget?.status === 'RESOLVED' ? 'Mark as Resolved' : 'Close Issue'}
        message={
          statusTarget?.status === 'RESOLVED'
            ? `Mark "${statusTarget?.issue.title}" as resolved? This indicates the issue has been fixed.`
            : `Close "${statusTarget?.issue.title}"? Closed issues are considered final and inactive.`
        }
        confirmLabel={statusTarget?.status === 'RESOLVED' ? 'Mark Resolved' : 'Close Issue'}
        variant="warning"
        onConfirm={handleStatusChangeConfirm}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  )
}
