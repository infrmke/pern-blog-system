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

//  --- ROTAS PÚBLICAS ---

// @route GET /comments/post/:postId
router.get('/post/:postId', validatePostId, CommentController.getByPost)

//  --- ROTAS PROTEGIDAS ---

// @route POST /comments/post/:postId
router.post(
  '/post/:postId',
  verifyAccessToken,
  validatePostId,
  commentValidator,
  CommentController.create
)

// @route PATCH /comments/:id
router.patch(
  '/:id',
  verifyAccessToken,
  validateId,
  verifyCommentOwnership,
  commentValidator,
  CommentController.update
)

// @route DELETE /comments/:id
router.delete(
  '/:id',
  verifyAccessToken,
  validateId,
  verifyCommentOwnership,
  CommentController.delete
)

export default router
