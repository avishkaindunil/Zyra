import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Zap, Mail, Lock, User } from 'lucide-react'
import { registerSchema, RegisterFormData } from '../lib/schemas'
import { useAuthStore } from '../store/authStore'
import { useToastContext } from '../components/ui/ToastProvider'
import { ThemeToggle } from '../components/ui/ThemeToggle'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const { toast } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (error) {
      toast(error, 'error')
      clearError()
    }
  }, [error, toast, clearError])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast('Account created successfully. Please sign in.', 'success')
      navigate('/login')
    } catch {
      // error handled via store
    }
  }

  return (
    <div className="min-h-screen bg-app-bg text-content-primary flex items-center justify-center px-6 py-10">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent text-white shadow-soft mb-4">
            <Zap size={26} />
          </div>
          <h1 className="font-display font-bold text-3xl text-gradient-subtle">Zyra</h1>
          <p className="text-content-secondary mt-2">Premium Issue Tracking</p>
        </div>

        <div className="card-elevated p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-content-primary">Create account</h2>
            <p className="text-content-secondary mt-2">
              Start tracking issues with your team today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Full name</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                />
                <input
                  {...register('name')}
                  type="text"
                  className="input-field pl-11"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-priority-critical">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Email address</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                />
                <input
                  {...register('email')}
                  type="email"
                  className="input-field pl-11"
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-priority-critical">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                />
                <input
                  {...register('password')}
                  type="password"
                  className="input-field pl-11"
                  placeholder="Create a password"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-priority-critical">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">Confirm password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="input-field pl-11"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-priority-critical">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-content-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}