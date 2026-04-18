import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface-base bg-gradient-mesh">
      <Sidebar />

      <main className="ml-64 flex min-h-screen flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
