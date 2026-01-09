import { Router } from 'express'

import PostController from './post.controller.js'

import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import isAdmin from '../../middlewares/isAdmin.js'
import { verifyPostOwnership } from '../../middlewares/verifyOwnership.js'
import { createPostValidator, updatePostValidator } from './post.validator.js'

const router = Router()

router.get('/', PostController.getAll)
router.get('/search', PostController.getByTitle)
router.get('/author', PostController.getByAuthor)
router.get('/slug/:slug', PostController.getBySlug)
router.get('/:id', PostController.getById)
router.post(
  '/',
  verifyAccessToken,
  isAdmin,
  createPostValidator,
  PostController.create
)
router.patch(
  '/:id',
  verifyAccessToken,
  isAdmin,
  verifyPostOwnership,
  updatePostValidator,
  PostController.update
)
router.delete(
  '/:id',
  verifyAccessToken,
  isAdmin,
  verifyPostOwnership,
  PostController.delete
)

export default router
