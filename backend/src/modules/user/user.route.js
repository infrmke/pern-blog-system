import { Router } from 'express'
import UserController from './user.controller.js'
import { registerValidator, updateValidator } from './user.validator.js'
import {
  validateId,
  validateSlug,
} from '../../validators/identifiers.validator.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

//  --- ROTAS PÚBLICAS ---

// @route GET /users
router.get('/', UserController.getAll)

// @route GET /users/profile/:slug
router.get('/profile/:slug', validateSlug, UserController.getBySlug)

// @route POST /users
router.post('/', registerValidator, UserController.create)

// @route GET /users/:id
router.get('/:id', validateId, UserController.getById)

//  --- ROTAS PROTEGIDAS ---

// @route PATCH /users/:id
router.patch(
  '/:id',
  verifyAccessToken,
  validateId,
  updateValidator,
  UserController.update
)

// @route DELETE /users/:id
router.delete('/:id', verifyAccessToken, validateId, UserController.delete)

export default router
