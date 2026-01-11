import { Router } from 'express'

import CommentController from './comment.controller.js'
import commentValidator from './comment.validator.js'
import { validatePostId } from '../../validators/identifiers.validator.js'
import {
  commentControl,
  protectedPostResource,
} from '../../middlewares/tollPlaza.js'

const router = Router()

//  --- ROTAS PÚBLICAS ---

// @route GET /comments/post/:postId
router.get('/post/:postId', validatePostId, CommentController.getByPost)

//  --- ROTAS PROTEGIDAS ---

// @route POST /comments/post/:postId
router.post(
  '/post/:postId',
  protectedPostResource,
  commentValidator,
  CommentController.create
)

// @route PATCH /comments/:id
router.patch('/:id', commentControl, commentValidator, CommentController.update)

// @route DELETE /comments/:id
router.delete('/:id', commentControl, CommentController.delete)

export default router
