import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, CheckCircle, XCircle, Clock, Calendar, User } from 'lucide-react'
import { useIssueStore } from '../store/issueStore'
import { StatusBadge, PriorityBadge, SeverityBadge } from '../components/ui/Badge'
import { IssueFormModal } from '../components/issues/IssueFormModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useToastContext } from '../components/ui/ToastProvider'
import { Skeleton } from '../components/ui/Skeleton'
import { formatDateTime, formatRelativeTime, getInitials } from '../lib/utils'
import { IssueFormData } from '../lib/schemas'
import { Issue } from '../types'

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToastContext()

  const { currentIssue, isLoading, fetchIssue, updateIssue, deleteIssue } = useIssueStore()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<Issue['status'] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (id) fetchIssue(id)
  }, [id, fetchIssue])

  const handleUpdate = async (data: IssueFormData) => {
    if (!currentIssue) return
    setIsSubmitting(true)
    try {
      await updateIssue(currentIssue.id, data)
      toast('Issue updated', 'success')
      setEditOpen(false)
    } catch {
      toast('Failed to update issue', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentIssue) return
    setIsDeleting(true)
    try {
      await deleteIssue(currentIssue.id)
      toast('Issue deleted', 'success')
      navigate('/issues')
    } catch {
      toast('Failed to delete issue', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async () => {
    if (!currentIssue || !statusTarget) return
    try {
      await updateIssue(currentIssue.id, { status: statusTarget })
      toast(`Issue marked as ${statusTarget.toLowerCase().replace('_', ' ')}`, 'success')
      setStatusTarget(null)
    } catch {
      toast('Failed to update status', 'error')
    }
  }

  if (isLoading || !currentIssue) {
    return (
      <div className="p-6 space-y-5">
        <Skeleton className="h-8 w-48 rounded" />
        <div className="glass-card p-6 space-y-4">
          <Skeleton className="h-7 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    )
  }

  const issue = currentIssue
  const isResolvable = issue.status === 'OPEN' || issue.status === 'IN_PROGRESS'

  return (
    <div className="p-6 space-y-5 page-enter max-w-4xl">
      {/* Back nav */}
      <Link to="/issues" className="btn-ghost gap-2 -ml-1">
        <ArrowLeft size={16} />
        Back to issues
      </Link>

      {/* Main card */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                <SeverityBadge severity={issue.severity} />
              </div>
              <h1 className="font-display font-bold text-xl text-content-primary leading-tight">
                {issue.title}
              </h1>
              <p className="text-xs font-mono text-content-muted mt-2">
                #{issue.id}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isResolvable && (
                <button
                  onClick={() => setStatusTarget('RESOLVED')}
                  className="btn-ghost text-status-resolved gap-1.5 text-xs"
                >
                  <CheckCircle size={14} />
                  Resolve
                </button>
              )}
              {issue.status !== 'CLOSED' && (
                <button
                  onClick={() => setStatusTarget('CLOSED')}
                  className="btn-ghost text-status-closed gap-1.5 text-xs"
                >
                  <XCircle size={14} />
                  Close
                </button>
              )}
              <button onClick={() => setEditOpen(true)} className="btn-secondary">
                <Pencil size={14} />
                Edit
              </button>
              <button onClick={() => setDeleteOpen(true)} className="btn-danger">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-3">
              Description
            </h3>
            {issue.description ? (
              <div className="text-sm text-content-secondary leading-relaxed whitespace-pre-wrap bg-surface-base rounded-xl p-4 border border-border">
                {issue.description}
              </div>
            ) : (
              <p className="text-sm text-content-muted italic">No description provided.</p>
            )}
          </div>

          {/* Metadata sidebar */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-3">
                Details
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center gap-3">
                  <dt className="flex items-center gap-1.5 text-xs text-content-muted w-24 shrink-0">
                    <User size={12} />
                    Reporter
                  </dt>
                  <dd className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-light border border-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-accent">
                        {getInitials(issue.user.name)}
                      </span>
                    </div>
                    <span className="text-xs text-content-primary">{issue.user.name}</span>
                  </dd>
                </div>

                <div className="flex items-start gap-3">
                  <dt className="flex items-center gap-1.5 text-xs text-content-muted w-24 shrink-0 mt-0.5">
                    <Calendar size={12} />
                    Created
                  </dt>
                  <dd className="text-xs text-content-primary">
                    {formatDateTime(issue.createdAt)}
                    <span className="block text-content-muted mt-0.5">{formatRelativeTime(issue.createdAt)}</span>
                  </dd>
                </div>

                <div className="flex items-start gap-3">
                  <dt className="flex items-center gap-1.5 text-xs text-content-muted w-24 shrink-0 mt-0.5">
                    <Clock size={12} />
                    Updated
                  </dt>
                  <dd className="text-xs text-content-primary">
                    {formatDateTime(issue.updatedAt)}
                    <span className="block text-content-muted mt-0.5">{formatRelativeTime(issue.updatedAt)}</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status indicator */}
            <div className="p-4 rounded-xl bg-surface-base border border-border">
              <p className="text-xs text-content-muted mb-2 font-semibold uppercase tracking-wider">Current Status</p>
              <StatusBadge status={issue.status} />
              {issue.status === 'RESOLVED' && (
                <p className="text-xs text-status-resolved mt-2">✓ This issue has been resolved</p>
              )}
              {issue.status === 'CLOSED' && (
                <p className="text-xs text-status-closed mt-2">This issue has been closed</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <IssueFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        issue={issue}
        isSubmitting={isSubmitting}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete Issue"
        message={`Are you sure you want to permanently delete "${issue.title}"? This action cannot be undone.`}
        confirmLabel="Delete Issue"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      {/* Status confirm */}
      <ConfirmDialog
        isOpen={!!statusTarget}
        title={statusTarget === 'RESOLVED' ? 'Mark as Resolved' : 'Close Issue'}
        message={
          statusTarget === 'RESOLVED'
            ? 'Mark this issue as resolved? This indicates the underlying problem has been fixed.'
            : 'Close this issue? Closed issues are considered final and will no longer be actively tracked.'
        }
        confirmLabel={statusTarget === 'RESOLVED' ? 'Mark Resolved' : 'Close Issue'}
        variant="warning"
        onConfirm={handleStatusChange}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  )
}
