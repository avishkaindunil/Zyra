import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-5">
        <Icon size={28} className="text-content-muted" />
      </div>
      <h3 className="font-display font-semibold text-content-primary text-lg mb-2">{title}</h3>
      <p className="text-content-secondary text-sm max-w-xs leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  )
}
