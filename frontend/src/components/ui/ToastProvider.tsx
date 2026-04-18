import React, { createContext, useContext } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X, LucideIcon } from 'lucide-react'
import { useToast, Toast, ToastVariant } from '../../hooks/useToast'
import { cn } from '../../lib/utils'

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_STYLES: Record<ToastVariant, string> = {
  success: 'border-status-resolved/40 bg-status-resolved-bg text-status-resolved',
  error: 'border-priority-critical/40 bg-priority-critical-bg text-priority-critical',
  warning: 'border-priority-high/40 bg-priority-high-bg text-priority-high',
  info: 'border-accent/40 bg-accent-lighter text-accent',
}

const TOAST_ICONS: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = TOAST_ICONS[toast.variant]

  return (
    <div
      className={cn(
        'flex min-w-[300px] max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-modal backdrop-blur-sm',
        'animate-slide-up',
        TOAST_STYLES[toast.variant]
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm font-medium text-content-primary">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-content-muted transition-colors hover:text-content-secondary"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
        {toasts.map((toastItem) => (
          <ToastItem key={toastItem.id} toast={toastItem} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }

  return context
}
