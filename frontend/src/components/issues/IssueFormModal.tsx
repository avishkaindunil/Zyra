import { useEffect } from 'react'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2, ChevronDown } from 'lucide-react'
import { issueSchema, IssueFormData } from '../../lib/schemas'
import { Issue } from '../../types'

interface IssueFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: IssueFormData) => Promise<void>
  issue?: Issue | null
  isSubmitting?: boolean
}

interface SelectFieldProps {
  id: string
  label: string
  options: { value: string; label: string }[]
  registration: UseFormRegisterReturn
}

function SelectField({ id, label, options, registration }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <select id={id} {...registration} className="input-field appearance-none pr-10">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-content-muted"
        />
      </div>
    </div>
  )
}

export function IssueFormModal({
  isOpen,
  onClose,
  onSubmit,
  issue,
  isSubmitting,
}: IssueFormModalProps) {
  const isEdit = Boolean(issue)

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
    if (!isOpen) return

    if (issue) {
      reset({
        title: issue.title,
        description: issue.description || '',
        status: issue.status,
        priority: issue.priority,
        severity: issue.severity,
      })
      return
    }

    reset({
      title: '',
      description: '',
      status: 'OPEN',
      priority: 'MEDIUM',
      severity: 'MEDIUM',
    })
  }, [isOpen, issue, reset])

  if (!isOpen) return null

  const handleFormSubmit = async (data: IssueFormData) => {
    await onSubmit(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-overlay/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl animate-slide-up overflow-hidden rounded-2xl border border-border bg-surface-primary shadow-modal">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-content-primary">
              {isEdit ? 'Edit Issue' : 'Create New Issue'}
            </h2>
            <p className="mt-0.5 text-xs text-content-muted">
              {isEdit ? 'Update issue details below' : 'Fill in the details for your new issue'}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 text-content-muted">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="title" className="label">
              Title <span className="text-priority-critical">*</span>
            </label>
            <input
              id="title"
              {...register('title')}
              placeholder="Brief, descriptive issue title"
              className="input-field"
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-priority-critical">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SelectField
              id="status"
              label="Status"
              options={[
                { value: 'OPEN', label: 'Open' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'RESOLVED', label: 'Resolved' },
                { value: 'CLOSED', label: 'Closed' },
              ]}
              registration={register('status')}
            />
            <SelectField
              id="priority"
              label="Priority"
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'CRITICAL', label: 'Critical' },
              ]}
              registration={register('priority')}
            />
            <SelectField
              id="severity"
              label="Severity"
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'CRITICAL', label: 'Critical' },
              ]}
              registration={register('severity')}
            />
          </div>

          <div className="flex gap-3 border-t border-border pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
