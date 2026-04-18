import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { getInitials } from '../../lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/issues', icon: ListChecks, label: 'Issues' },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-border bg-surface-primary/95 backdrop-blur-xl">
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-content-primary">
              Zyra
            </span>
            <span className="-mt-0.5 block text-[10px] uppercase tracking-widest text-content-muted">
              Issue Tracker
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-content-muted">
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div className={isActive ? 'nav-item-active' : 'nav-item'}>
                <Icon size={16} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <div className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-surface-hover">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-light">
            <span className="text-xs font-bold text-accent">
              {getInitials(user?.name || 'U')}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-content-primary">{user?.name}</p>
            <p className="truncate text-xs text-content-muted">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-content-muted opacity-0 transition-all hover:text-priority-critical group-hover:opacity-100"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
