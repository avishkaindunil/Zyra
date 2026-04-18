import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { ToastProvider } from './components/ui/ToastProvider'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { IssuesPage } from './pages/IssuesPage'
import { IssueDetailPage } from './pages/IssueDetailPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
