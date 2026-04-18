import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton bg-gradient-to-r from-surface-elevated via-surface-hover to-surface-elevated bg-[length:200%_100%]',
        className
      )}
    />
  )
}

export function IssueRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border">
      <Skeleton className="w-4 h-4 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <Skeleton className="h-4 w-24 rounded mb-3" />
      <Skeleton className="h-8 w-16 rounded mb-2" />
      <Skeleton className="h-3 w-32 rounded" />
    </div>
  )
}
