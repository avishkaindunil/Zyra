import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-overlay/70 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md animate-slide-up glass-card p-6 shadow-modal">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-content-muted transition-colors hover:text-content-secondary"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex items-start gap-4">
          <div
            className={`rounded-xl p-2.5 ${
              variant === 'danger'
                ? 'bg-priority-critical-bg text-priority-critical'
                : 'bg-priority-high-bg text-priority-high'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="mb-1 font-display text-lg font-semibold leading-tight text-content-primary">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-content-secondary">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary" disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
