import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import { IssueFilters } from '../../types'
import { cn } from '../../lib/utils'

interface IssueFiltersBarProps {
  filters: IssueFilters
  onFilterChange: (filters: Partial<IssueFilters>) => void
  onReset: () => void
  resultCount?: number
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
]

interface SelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}

function FilterSelect({ value, onChange, options, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'bg-surface-primary border border-border hover:border-border-strong text-sm text-content-primary',
        'rounded-lg px-3 py-2 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
        'transition-all duration-150 cursor-pointer appearance-none pr-7',
        !value && 'text-content-secondary',
        className
      )}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237E89A9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '16px' }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function IssueFiltersBar({ filters, onFilterChange, onReset }: IssueFiltersBarProps) {
  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.severity

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Search issues..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="input-field pl-9 pr-9"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <FilterSelect
          value={filters.status}
          onChange={(v) => onFilterChange({ status: v as IssueFilters['status'] })}
          options={STATUS_OPTIONS}
        />

        {/* Priority filter */}
        <FilterSelect
          value={filters.priority}
          onChange={(v) => onFilterChange({ priority: v as IssueFilters['priority'] })}
          options={PRIORITY_OPTIONS}
        />

        {/* Severity filter */}
        <FilterSelect
          value={filters.severity}
          onChange={(v) => onFilterChange({ severity: v as IssueFilters['severity'] })}
          options={SEVERITY_OPTIONS}
        />

        {/* Sort */}
        <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 bg-surface-primary">
          <ArrowUpDown size={13} className="text-content-muted shrink-0" />
          <FilterSelect
            value={filters.sortBy}
            onChange={(v) => onFilterChange({ sortBy: v })}
            options={SORT_OPTIONS}
            className="border-0 bg-transparent px-1 focus:ring-0"
          />
          <button
            onClick={() => onFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            className="text-xs text-content-muted hover:text-content-primary transition-colors px-1 uppercase tracking-wider font-mono"
          >
            {filters.sortOrder}
          </button>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button onClick={onReset} className="btn-ghost text-content-muted gap-1.5">
            <X size={13} />
            Clear
          </button>
        )}

        {/* Active filter count */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 text-xs text-accent">
            <SlidersHorizontal size={12} />
            <span>Filters active</span>
          </div>
        )}
      </div>
    </div>
  )
}
