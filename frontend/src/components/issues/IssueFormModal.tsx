import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2 } from 'lucide-react'
import { issueSchema, IssueFormData } from '../../lib/schemas'
import { Issue } from '../../types'

interface IssueFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: IssueFormData) => Promise<void>
  issue?: Issue | null
  isSubmitting?: boolean
}

const FIELD_SELECT = (id: string, label: string, options: { value: string; label: string }[], reg: object) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    <select
      id={id}
      {...reg}
      className="input-field appearance-none"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237E89A9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
)

export function IssueFormModal({ isOpen, onClose, onSubmit, issue, isSubmitting }: IssueFormModalProps) {
  const isEdit = !!issue

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'OPEN',
      priority: 'MEDIUM',
      severity: 'MEDIUM',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (issue) {
        reset({
          title: issue.title,
          description: issue.description || '',
          status: issue.status,
          priority: issue.priority,
          severity: issue.severity,
        })
      } else {
        reset({ title: '', description: '', status: 'OPEN', priority: 'MEDIUM', severity: 'MEDIUM' })
      }
    }
  }, [isOpen, issue, reset])

  if (!isOpen) return null

  const handleFormSubmit = async (data: IssueFormData) => {
    await onSubmit(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-surface-primary border border-border rounded-2xl shadow-modal w-full max-w-xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-semibold text-content-primary text-lg">
              {isEdit ? 'Edit Issue' : 'Create New Issue'}
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              {isEdit ? 'Update issue details below' : 'Fill in the details for your new issue'}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 text-content-muted">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">Title <span className="text-priority-critical">*</span></label>
            <input
              id="title"
              {...register('title')}
              placeholder="Brief, descriptive issue title"
              className="input-field"
            />
            {errors.title && (
              <p className="text-xs text-priority-critical mt-1.5">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {/* Row: Status + Priority + Severity */}
          <div className="grid grid-cols-3 gap-3">
            {FIELD_SELECT('status', 'Status', [
              { value: 'OPEN', label: 'Open' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'RESOLVED', label: 'Resolved' },
              { value: 'CLOSED', label: 'Closed' },
            ], register('status'))}
            {FIELD_SELECT('priority', 'Priority', [
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ], register('priority'))}
            {FIELD_SELECT('severity', 'Severity', [
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ], register('severity'))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Create Issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
