import { create } from 'zustand'
import api from '../lib/api'
import {
  Issue,
  IssueFilters,
  IssueStats,
  PaginationMeta,
  CreateIssuePayload,
  UpdateIssuePayload,
} from '../types'
import { downloadBlob } from '../lib/utils'

interface IssueState {
  issues: Issue[]
  currentIssue: Issue | null
  stats: IssueStats | null
  meta: PaginationMeta | null
  filters: IssueFilters
  isLoading: boolean
  isStatsLoading: boolean
  error: string | null

  fetchIssues: () => Promise<void>
  fetchIssue: (id: string) => Promise<void>
  fetchStats: () => Promise<void>
  createIssue: (payload: CreateIssuePayload) => Promise<Issue>
  updateIssue: (id: string, payload: UpdateIssuePayload) => Promise<Issue>
  deleteIssue: (id: string) => Promise<void>
  setFilters: (filters: Partial<IssueFilters>) => void
  resetFilters: () => void
  exportIssues: (format: 'json' | 'csv') => Promise<void>
  clearError: () => void
  setCurrentIssue: (issue: Issue | null) => void
}

const defaultFilters: IssueFilters = {
  search: '',
  status: '',
  priority: '',
  severity: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  currentIssue: null,
  stats: null,
  meta: null,
  filters: { ...defaultFilters },
  isLoading: false,
  isStatsLoading: false,
  error: null,

  fetchIssues: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filters } = get()
      const params = new URLSearchParams()

      params.set('page', String(filters.page))
      params.set('limit', String(filters.limit))
      if (filters.search) params.set('search', filters.search)
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.severity) params.set('severity', filters.severity)
      params.set('sortBy', filters.sortBy)
      params.set('sortOrder', filters.sortOrder)

      const { data } = await api.get(`/issues?${params.toString()}`)
      set({ issues: data.issues, meta: data.meta, isLoading: false })
    } catch {
      set({ error: 'Failed to load issues', isLoading: false })
    }
  },

  fetchIssue: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/issues/${id}`)
      set({ currentIssue: data.issue, isLoading: false })
    } catch {
      set({ error: 'Failed to load issue', isLoading: false })
    }
  },

  fetchStats: async () => {
    set({ isStatsLoading: true })
    try {
      const { data } = await api.get('/issues/stats')
      set({ stats: data, isStatsLoading: false })
    } catch {
      set({ isStatsLoading: false })
    }
  },

  createIssue: async (payload) => {
    const { data } = await api.post('/issues', payload)
    await get().fetchIssues()
    await get().fetchStats()
    return data.issue
  },

  updateIssue: async (id, payload) => {
    const { data } = await api.put(`/issues/${id}`, payload)
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? data.issue : i)),
      currentIssue: state.currentIssue?.id === id ? data.issue : state.currentIssue,
    }))
    await get().fetchStats()
    return data.issue
  },

  deleteIssue: async (id) => {
    await api.delete(`/issues/${id}`)
    set((state) => ({ issues: state.issues.filter((i) => i.id !== id) }))
    await get().fetchStats()
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        page: 'page' in newFilters ? (newFilters.page ?? 1) : 1,
      },
    }))
  },

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  exportIssues: async (format) => {
    const { data } = await api.get(`/issues/export?format=${format}`, {
      responseType: 'blob',
    })
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json'
    const blob = new Blob([data], { type: mimeType })
    downloadBlob(blob, `issues.${format}`)
  },

  clearError: () => set({ error: null }),
  setCurrentIssue: (issue) => set({ currentIssue: issue }),
}))
