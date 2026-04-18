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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative glass-card shadow-modal w-full max-w-md animate-slide-up p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-content-muted hover:text-content-secondary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div
            className={`p-2.5 rounded-xl ${
              variant === 'danger'
                ? 'bg-priority-critical-bg text-priority-critical'
                : 'bg-priority-high-bg text-priority-high'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-content-primary text-lg leading-tight mb-1">
              {title}
            </h3>
            <p className="text-content-secondary text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary" disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={
              variant === 'danger' ? 'btn-danger' : 'btn-primary'
            }
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
