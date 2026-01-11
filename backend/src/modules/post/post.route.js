import { Router } from 'express'

import PostController from './post.controller.js'
import { createPostValidator, updatePostValidator } from './post.validator.js'
import { validateSlug } from '../../validators/identifiers.validator.js'
import { adminAccess, postControl } from '../../middlewares/tollPlaza.js'

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
router.post('/', adminAccess, createPostValidator, PostController.create)

// @route PATCH /posts/:id
router.patch('/:id', postControl, updatePostValidator, PostController.update)

// @route DELETE /posts/
router.delete('/:id', postControl, PostController.delete)

export default router
