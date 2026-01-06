import { Router } from 'express'

import PostController from './post.controller.js'

import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import isAdmin from '../../middlewares/isAdmin.js'
import verifyOwnership from '../../middlewares/verifyOwnership.js'

const router = Router()

router.get('/', PostController.getAll)
router.get('/search', PostController.getByTitle)
router.get('/author', PostController.getByAuthor)
router.get('/slug/:slug', PostController.getBySlug)
router.get('/:id', PostController.getById)
router.post('/', verifyAccessToken, isAdmin, PostController.create)
router.patch(
  '/:id',
  verifyAccessToken,
  isAdmin,
  verifyOwnership,
  PostController.update
)
router.delete(
  '/:id',
  verifyAccessToken,
  isAdmin,
  verifyOwnership,
  PostController.delete
)

export default router
