import { Response, NextFunction } from 'express'
import { z } from 'zod'
import { IssueStatus, Priority, Severity, Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'

const createIssueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  severity: z.nativeEnum(Severity).optional(),
})

const updateIssueSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(IssueStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  severity: z.nativeEnum(Severity).optional(),
})

const getAuthenticatedUserId = (req: AuthRequest): string => {
  const userId = req.user?.id

  if (!userId) {
    throw createError('Unauthorized', 401)
  }

  return userId
}

export const getIssues = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)

    const {
      page = '1',
      limit = '10',
      search = '',
      status,
      priority,
      severity,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string>

    const parsedPage = parseInt(page, 10)
    const parsedLimit = parseInt(limit, 10)

    const pageNum = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage)
    const limitNum = Number.isNaN(parsedLimit)
      ? 10
      : Math.min(100, Math.max(1, parsedLimit))

    const skip = (pageNum - 1) * limitNum

    const where: Prisma.IssueWhereInput = {
      userId,
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (status && Object.values(IssueStatus).includes(status as IssueStatus)) {
      where.status = status as IssueStatus
    }

    if (priority && Object.values(Priority).includes(priority as Priority)) {
      where.priority = priority as Priority
    }

    if (severity && Object.values(Severity).includes(severity as Severity)) {
      where.severity = severity as Severity
    }

    const validSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'status']
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'
    const orderDir = sortOrder === 'asc' ? 'asc' : 'desc'

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [orderField]: orderDir },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.issue.count({ where }),
    ])

    res.json({
      issues,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getIssueById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)
    const { id } = req.params

    const issue = await prisma.issue.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    if (!issue) {
      throw createError('Issue not found', 404)
    }

    res.json({ issue })
  } catch (err) {
    next(err)
  }
}

export const createIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)
    const data = createIssueSchema.parse(req.body)

    const issue = await prisma.issue.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    res.status(201).json({ message: 'Issue created successfully', issue })
  } catch (err) {
    next(err)
  }
}

export const updateIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)
    const { id } = req.params
    const data = updateIssueSchema.parse(req.body)

    const existing = await prisma.issue.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      throw createError('Issue not found', 404)
    }

    const issue = await prisma.issue.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    res.json({ message: 'Issue updated successfully', issue })
  } catch (err) {
    next(err)
  }
}

export const deleteIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)
    const { id } = req.params

    const existing = await prisma.issue.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      throw createError('Issue not found', 404)
    }

    await prisma.issue.delete({
      where: { id },
    })

    res.json({ message: 'Issue deleted successfully' })
  } catch (err) {
    next(err)
  }
}

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)

    const [statusGroups, priorityGroups, total, recentIssues] = await Promise.all([
      prisma.issue.groupBy({
        by: ['status'],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.issue.groupBy({
        by: ['priority'],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.issue.count({
        where: { userId },
      }),
      prisma.issue.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true } } },
      }),
    ])

    const statusCounts = Object.fromEntries(
      statusGroups.map((g) => [g.status, g._count._all])
    )

    const priorityCounts = Object.fromEntries(
      priorityGroups.map((g) => [g.priority, g._count._all])
    )

    res.json({
      total,
      byStatus: {
        OPEN: statusCounts['OPEN'] || 0,
        IN_PROGRESS: statusCounts['IN_PROGRESS'] || 0,
        RESOLVED: statusCounts['RESOLVED'] || 0,
        CLOSED: statusCounts['CLOSED'] || 0,
      },
      byPriority: {
        LOW: priorityCounts['LOW'] || 0,
        MEDIUM: priorityCounts['MEDIUM'] || 0,
        HIGH: priorityCounts['HIGH'] || 0,
        CRITICAL: priorityCounts['CRITICAL'] || 0,
      },
      recentIssues,
    })
  } catch (err) {
    next(err)
  }
}

export const exportIssues = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req)
    const { format = 'json' } = req.query as { format?: string }

    const issues = await prisma.issue.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    })

    if (format === 'csv') {
      const headers = [
        'ID',
        'Title',
        'Description',
        'Status',
        'Priority',
        'Severity',
        'Created By',
        'Email',
        'Created At',
        'Updated At',
      ]

      const rows = issues.map((issue) => [
        issue.id,
        `"${issue.title.replace(/"/g, '""')}"`,
        `"${(issue.description || '').replace(/"/g, '""')}"`,
        issue.status,
        issue.priority,
        issue.severity,
        issue.user.name,
        issue.user.email,
        issue.createdAt.toISOString(),
        issue.updatedAt.toISOString(),
      ])

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="issues.csv"')
      res.send(csv)
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', 'attachment; filename="issues.json"')
      res.json(issues)
    }
  } catch (err) {
    next(err)
  }
}