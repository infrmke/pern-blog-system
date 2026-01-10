import { Router } from 'express'

import CommentController from './comment.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import { verifyCommentOwnership } from '../../middlewares/verifyOwnership.js'
import commentValidator from './comment.validator.js'
import {
  validateId,
  validatePostId,
} from '../../validators/identifiers.validator.js'

const router = Router()

router.get('/post/:postId', validatePostId, CommentController.getByPost)
router.post(
  '/post/:postId',
  verifyAccessToken,
  validatePostId,
  commentValidator,
  CommentController.create
)
router.patch(
  '/:id',
  verifyAccessToken,
  validateId,
  verifyCommentOwnership,
  commentValidator,
  CommentController.update
)
router.delete(
  '/:id',
  verifyAccessToken,
  validateId,
  verifyCommentOwnership,
  CommentController.delete
)

export default router
