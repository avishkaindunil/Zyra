import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { useIssueStore } from '../store/issueStore'
import { useAuthStore } from '../store/authStore'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import { RecentIssues } from '../components/dashboard/RecentIssues'
import { PriorityChart } from '../components/dashboard/PriorityChart'
import { ThemeToggle } from '../components/ui/ThemeToggle'

export function DashboardPage() {
  const { stats, isStatsLoading, fetchStats } = useIssueStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 p-6 page-enter">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm text-content-muted">{greeting},</p>
          <h1 className="font-display text-2xl font-bold text-gradient-subtle">
            {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-content-secondary">
            Here's an overview of your issue tracker
          </p>
        </div>

        <div className="flex items-center gap-3 self-start pt-1">
          <ThemeToggle />

          <Link to="/issues" className="btn-primary">
            <Plus size={16} />
            New Issue
          </Link>
        </div>
      </div>

      <StatsGrid stats={stats} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentIssues issues={stats?.recentIssues || []} isLoading={isStatsLoading} />
        </div>

        <div className="flex flex-col gap-4">
          <PriorityChart stats={stats} isLoading={isStatsLoading} />

          <div className="glass-card p-5">
            <h3 className="mb-3 text-sm font-display font-semibold text-content-primary">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/issues?status=OPEN"
                className="group flex items-center justify-between rounded-lg p-3 text-sm transition-colors hover:bg-surface-hover"
              >
                <span className="text-content-secondary transition-colors group-hover:text-content-primary">
                  View open issues
                </span>
                <ArrowRight
                  size={13}
                  className="text-content-muted transition-colors group-hover:text-accent"
                />
              </Link>
              <Link
                to="/issues?priority=CRITICAL"
                className="group flex items-center justify-between rounded-lg p-3 text-sm transition-colors hover:bg-surface-hover"
              >
                <span className="text-content-secondary transition-colors group-hover:text-content-primary">
                  Critical issues
                </span>
                <ArrowRight
                  size={13}
                  className="text-content-muted transition-colors group-hover:text-accent"
                />
              </Link>
              <Link
                to="/issues?status=IN_PROGRESS"
                className="group flex items-center justify-between rounded-lg p-3 text-sm transition-colors hover:bg-surface-hover"
              >
                <span className="text-content-secondary transition-colors group-hover:text-content-primary">
                  In progress
                </span>
                <ArrowRight
                  size={13}
                  className="text-content-muted transition-colors group-hover:text-accent"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
