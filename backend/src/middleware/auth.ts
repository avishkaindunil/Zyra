import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access denied. No token provided.' })
      return
    }

    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET as string

    const decoded = jwt.verify(token, secret) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid token. User not found.' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
