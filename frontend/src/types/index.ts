/* ─── Enums ─── */
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

/* ─── User ─── */
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

/* ─── Issue ─── */
export interface Issue {
  id: string
  title: string
  description?: string | null
  status: IssueStatus
  priority: Priority
  severity: Severity
  createdAt: string
  updatedAt: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
}

/* ─── API Responses ─── */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface IssueListResponse {
  issues: Issue[]
  meta: PaginationMeta
}

export interface IssueStats {
  total: number
  byStatus: Record<IssueStatus, number>
  byPriority: Record<Priority, number>
  recentIssues: Issue[]
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

/* ─── Form Payloads ─── */
export interface CreateIssuePayload {
  title: string
  description?: string
  status?: IssueStatus
  priority?: Priority
  severity?: Severity
}

export interface UpdateIssuePayload extends Partial<CreateIssuePayload> {}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

/* ─── Filters ─── */
export interface IssueFilters {
  search: string
  status: IssueStatus | ''
  priority: Priority | ''
  severity: Severity | ''
  sortBy: string
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}
