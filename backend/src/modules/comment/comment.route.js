import { Router } from 'express'

import CommentController from './comment.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import { verifyCommentOwnership } from '../../middlewares/verifyOwnership.js'
import commentValidator from './comment.validator.js'
import handleValidation from '../../middlewares/handleValidation.js'

const router = Router()

router.get('/post/:postId', CommentController.getByPost)
router.post(
  '/post/:postId',
  verifyAccessToken,
  commentValidator,
  handleValidation,
  CommentController.create
)
router.patch(
  '/:id',
  verifyAccessToken,
  verifyCommentOwnership,
  commentValidator,
  handleValidation,
  CommentController.update
)
router.delete(
  '/:id',
  verifyAccessToken,
  verifyCommentOwnership,
  CommentController.delete
)

export default router
