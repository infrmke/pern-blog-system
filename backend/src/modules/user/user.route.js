import { Router } from 'express'
import UserController from './user.controller.js'
import { registerValidator, updateValidator } from './user.validator.js'
import {
  validateId,
  validateSlug,
} from '../../validators/identifiers.validator.js'

const router = Router()

router.post('/', registerValidator, UserController.create)
router.get('/', UserController.getAll)
router.get('/:id', validateId, UserController.getById)
router.patch('/:id', validateId, updateValidator, UserController.update)
router.delete('/:id', validateId, UserController.delete)
router.get('/profile/:slug', validateSlug, UserController.getBySlug)

export default router
