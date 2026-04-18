import React, { createContext, useContext } from 'react'
import { useToast, Toast, ToastVariant } from '../../hooks/useToast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-modal backdrop-blur-sm',
        'animate-slide-up min-w-[300px] max-w-[420px]',
        TOAST_STYLES[toast.variant]
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <p className="text-sm font-medium flex-1 text-content-primary">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-content-muted hover:text-content-secondary transition-colors shrink-0"
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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}