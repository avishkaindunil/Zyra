import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IssueStatus, Priority, Severity } from '../types'

/* ─── Tailwind class merger ─── */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ─── Date formatting ─── */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then

  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateStr)
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

/* ─── Status config ─── */
export const STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  OPEN: {
    label: 'Open',
    color: 'text-status-open',
    bg: 'bg-status-open-bg',
    dot: 'bg-status-open',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-status-in-progress',
    bg: 'bg-status-in-progress-bg',
    dot: 'bg-status-in-progress',
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'text-status-resolved',
    bg: 'bg-status-resolved-bg',
    dot: 'bg-status-resolved',
  },
  CLOSED: {
    label: 'Closed',
    color: 'text-status-closed',
    bg: 'bg-status-closed-bg',
    dot: 'bg-status-closed',
  },
}

/* ─── Priority config ─── */
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; border: string }
> = {
  LOW: {
    label: 'Low',
    color: 'text-priority-low',
    bg: 'bg-priority-low-bg',
    border: 'border-priority-low/30',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-priority-medium',
    bg: 'bg-priority-medium-bg',
    border: 'border-priority-medium/30',
  },
  HIGH: {
    label: 'High',
    color: 'text-priority-high',
    bg: 'bg-priority-high-bg',
    border: 'border-priority-high/30',
  },
  CRITICAL: {
    label: 'Critical',
    color: 'text-priority-critical',
    bg: 'bg-priority-critical-bg',
    border: 'border-priority-critical/30',
  },
}

/* ─── Severity config ─── */
export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bg: string }
> = {
  LOW: { label: 'Low', color: 'text-priority-low', bg: 'bg-priority-low-bg' },
  MEDIUM: { label: 'Medium', color: 'text-priority-medium', bg: 'bg-priority-medium-bg' },
  HIGH: { label: 'High', color: 'text-priority-high', bg: 'bg-priority-high-bg' },
  CRITICAL: { label: 'Critical', color: 'text-priority-critical', bg: 'bg-priority-critical-bg' },
}

/* ─── Download helper ─── */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ─── Debounce ─── */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/* ─── Truncate ─── */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}

/* ─── Get initials ─── */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
