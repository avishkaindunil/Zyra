import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Zap, Mail, Lock } from 'lucide-react'
import { loginSchema, LoginFormData } from '../lib/schemas'
import { useAuthStore } from '../store/authStore'
import { useToastContext } from '../components/ui/ToastProvider'
import { ThemeToggle } from '../components/ui/ThemeToggle'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const { toast } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toast(error, 'error')
      clearError()
    }
  }, [error, toast, clearError])

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      toast('Welcome back!', 'success')
      navigate('/dashboard')
    } catch {
      // error handled via store
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-base bg-gradient-mesh p-4">
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none fixed left-1/4 top-0 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-64 w-64 rounded-full bg-status-open/8 blur-3xl" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-glow-accent">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gradient-subtle">Zyra</h1>
          <p className="mt-1 text-sm text-content-muted">Premium Issue Tracking</p>
        </div>

        <div className="glass-card p-8 shadow-card">
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-content-primary">Sign in</h2>
            <p className="mt-1 text-sm text-content-secondary">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="input-field pl-9"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-priority-critical">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="input-field pl-9"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-priority-critical">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary mt-2 w-full py-3">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <p className="text-sm text-content-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-accent transition-colors hover:text-accent-hover">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
