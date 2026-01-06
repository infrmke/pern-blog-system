import { Router } from 'express'

import CommentController from './comment.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import { verifyCommentOwnership } from '../../middlewares/verifyOwnership.js'

const router = Router()

router.get('/post/:postId', CommentController.getByPost)
router.post('/post/:postId', verifyAccessToken, CommentController.create)
router.patch(
  '/:id',
  verifyAccessToken,
  verifyCommentOwnership,
  CommentController.update
)
router.delete(
  '/:id',
  verifyAccessToken,
  verifyCommentOwnership,
  CommentController.delete
)

export default router
