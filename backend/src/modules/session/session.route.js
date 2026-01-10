import { Router } from 'express'

import SessionController from './session.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import loginValidator from './session.validator.js'

const router = Router()

//  --- ROTAS PÚBLICAS ---

// @route POST /sessions/login
router.post('/login', loginValidator, SessionController.logIn)

//  --- ROTAS PROTEGIDAS ---

// @route GET /sessions/me
router.get('/me', verifyAccessToken, SessionController.status)

// @route POST /sessions/logout
router.post('/logout', verifyAccessToken, SessionController.logOut)

export default router
