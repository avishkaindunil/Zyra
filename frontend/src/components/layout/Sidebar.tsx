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
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-primary border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-content-primary text-lg tracking-tight">
              Zyra
            </span>
            <span className="block text-[10px] text-content-muted uppercase tracking-widest -mt-0.5">
              Issue Tracker
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-semibold text-content-muted uppercase tracking-widest mb-3">
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

      {/* User info */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors group">
          <div className="w-8 h-8 rounded-full bg-accent-light border border-accent/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-accent">
              {getInitials(user?.name || 'U')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-content-primary truncate">
              {user?.name}
            </p>
            <p className="text-xs text-content-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 transition-all text-content-muted hover:text-priority-critical"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
