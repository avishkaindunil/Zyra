import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Zap, Mail, Lock } from 'lucide-react'
import { loginSchema, LoginFormData } from '../lib/schemas'
import { useAuthStore } from '../store/authStore'
import { useToastContext } from '../components/ui/ToastProvider'

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
    <div className="min-h-screen bg-surface-base bg-gradient-mesh flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-64 h-64 bg-status-open/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-glow-accent mb-4">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-gradient-subtle">Zyra</h1>
          <p className="text-content-muted text-sm mt-1">Premium Issue Tracking</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-xl text-content-primary">Sign in</h2>
            <p className="text-content-secondary text-sm mt-1">Welcome back. Enter your credentials to continue.</p>
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
                <p className="text-xs text-priority-critical mt-1.5">{errors.email.message}</p>
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
                <p className="text-xs text-priority-critical mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
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

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-content-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
