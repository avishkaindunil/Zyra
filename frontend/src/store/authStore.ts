import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'
import { User, LoginPayload, RegisterPayload } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  clearError: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null })

        try {
          const { data } = await api.post('/auth/login', payload)

          localStorage.setItem('auth_token', data.token)

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || 'Login failed. Please try again.'

          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })

        try {
          await api.post('/auth/register', payload)

          localStorage.removeItem('auth_token')

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || 'Registration failed. Please try again.'

          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user })
        } catch {
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)