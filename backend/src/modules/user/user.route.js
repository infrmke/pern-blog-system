import { Router } from 'express'
import UserController from './user.controller.js'
import { registerValidator, updateValidator } from './user.validator.js'

const router = Router()

router.post('/', registerValidator, UserController.create)
router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.patch('/:id', updateValidator, UserController.update)
router.delete('/:id', UserController.delete)
router.get('/profile/:slug', UserController.getBySlug)

export default router
