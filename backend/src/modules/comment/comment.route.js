import { Router } from 'express'

import CommentController from './comment.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import { verifyCommentOwnership } from '../../middlewares/verifyOwnership.js'
import commentValidator from './comment.validator.js'

const router = Router()

router.get('/post/:postId', CommentController.getByPost)
router.post(
  '/post/:postId',
  verifyAccessToken,
  commentValidator,
  CommentController.create
)
router.patch(
  '/:id',
  verifyAccessToken,
  verifyCommentOwnership,
  commentValidator,
  CommentController.update
)
router.delete(
  '/:id',
  verifyAccessToken,
  verifyCommentOwnership,
  CommentController.delete
)

export default router
