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

  // Modal state
  const [formOpen, setFormOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Issue | null>(null)
  const [statusTarget, setStatusTarget] = useState<{ issue: Issue; status: Issue['status'] } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 400)

  // Sync URL query params on mount
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

  // Fetch when filters change (with debounced search)
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
    <div className="p-6 space-y-5 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-content-primary">Issues</h1>
          <p className="text-content-secondary text-sm mt-0.5">
            {meta ? `${meta.total} issue${meta.total !== 1 ? 's' : ''} total` : 'Manage and track all issues'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative group">
            <button className="btn-secondary gap-2" disabled={isExporting}>
              <Download size={15} />
              Export
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-surface-elevated border border-border rounded-xl shadow-modal z-20 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 animate-slide-down">
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-content-secondary hover:text-content-primary hover:bg-surface-hover"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-content-secondary hover:text-content-primary hover:bg-surface-hover"
              >
                Export JSON
              </button>
            </div>
          </div>

          <button
            onClick={() => fetchIssues()}
            className="btn-ghost p-2.5"
            title="Refresh"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button onClick={handleCreate} className="btn-primary">
            <Plus size={16} />
            New Issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <IssueFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* Table */}
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

      {/* Issue form modal */}
      <IssueFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingIssue(null) }}
        onSubmit={handleFormSubmit}
        issue={editingIssue}
        isSubmitting={isSubmitting}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Issue"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Issue"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Status change confirm */}
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
