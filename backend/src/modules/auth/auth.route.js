import { Router } from 'express'

import AuthController from './auth.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

router.get('/me', verifyAccessToken, AuthController.status)
router.post('/login', AuthController.logIn)
router.post('/logout', verifyAccessToken, AuthController.logOut)

export default router
