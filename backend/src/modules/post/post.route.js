import { Router } from 'express'

import PostController from './post.controller.js'

import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import isAdmin from '../../middlewares/isAdmin.js'
import { verifyPostOwnership } from '../../middlewares/verifyOwnership.js'
import { createPostValidator, updatePostValidator } from './post.validator.js'
import {
  validateId,
  validateSlug,
} from '../../validators/identifiers.validator.js'

const router = Router()

//  --- ROTAS PÚBLICAS ---

// @route GET /posts/
router.get('/', PostController.getAll)

// @route GET /posts/search
router.get('/search', PostController.getByTitle)

// @route GET /posts/author
router.get('/author', PostController.getByAuthor)

// @route GET /posts/slug/:slug
router.get('/slug/:slug', validateSlug, PostController.getBySlug)

// @route GET /posts/:id
router.get('/:id', PostController.getById)

//  --- ROTAS PROTEGIDAS ---

// @route POST /posts/
router.post(
  '/',
  verifyAccessToken,
  validateId,
  isAdmin,
  createPostValidator,
  PostController.create
)

// @route PATCH /posts/:id
router.patch(
  '/:id',
  verifyAccessToken,
  validateId,
  isAdmin,
  verifyPostOwnership,
  updatePostValidator,
  PostController.update
)

// @route DELETE /posts/
router.delete(
  '/:id',
  verifyAccessToken,
  validateId,
  isAdmin,
  verifyPostOwnership,
  PostController.delete
)

export default router
