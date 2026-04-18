import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { useIssueStore } from '../store/issueStore'
import { useAuthStore } from '../store/authStore'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import { RecentIssues } from '../components/dashboard/RecentIssues'
import { PriorityChart } from '../components/dashboard/PriorityChart'

export function DashboardPage() {
  const { stats, isStatsLoading, fetchStats } = useIssueStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-content-muted text-sm mb-1">{greeting},</p>
          <h1 className="font-display font-bold text-2xl text-gradient-subtle">
            {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-content-secondary text-sm mt-1">
            Here's an overview of your issue tracker
          </p>
        </div>
        <Link to="/issues" className="btn-primary">
          <Plus size={16} />
          New Issue
        </Link>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} isLoading={isStatsLoading} />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent issues takes 2/3 */}
        <div className="lg:col-span-2">
          <RecentIssues issues={stats?.recentIssues || []} isLoading={isStatsLoading} />
        </div>

        {/* Priority chart takes 1/3 */}
        <div className="flex flex-col gap-4">
          <PriorityChart stats={stats} isLoading={isStatsLoading} />

          {/* Quick actions */}
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-content-primary text-sm mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/issues?status=OPEN"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover transition-colors group text-sm"
              >
                <span className="text-content-secondary group-hover:text-content-primary transition-colors">
                  View open issues
                </span>
                <ArrowRight size={13} className="text-content-muted group-hover:text-accent transition-colors" />
              </Link>
              <Link
                to="/issues?priority=CRITICAL"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover transition-colors group text-sm"
              >
                <span className="text-content-secondary group-hover:text-content-primary transition-colors">
                  Critical issues
                </span>
                <ArrowRight size={13} className="text-content-muted group-hover:text-accent transition-colors" />
              </Link>
              <Link
                to="/issues?status=IN_PROGRESS"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover transition-colors group text-sm"
              >
                <span className="text-content-secondary group-hover:text-content-primary transition-colors">
                  In progress
                </span>
                <ArrowRight size={13} className="text-content-muted group-hover:text-accent transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
