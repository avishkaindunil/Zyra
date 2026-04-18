import { Router } from 'express'
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  getStats,
  exportIssues,
} from '../controllers/issueController'
import { authenticate } from '../middleware/auth'

const router = Router()

// All issue routes require authentication
router.use(authenticate)

router.get('/stats', getStats)
router.get('/export', exportIssues)
router.get('/', getIssues)
router.get('/:id', getIssueById)
router.post('/', createIssue)
router.put('/:id', updateIssue)
router.delete('/:id', deleteIssue)

export default router
