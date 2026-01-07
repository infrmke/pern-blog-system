import { Router } from 'express'

import SessionController from './session.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

router.get('/me', verifyAccessToken, SessionController.status)
router.post('/login', SessionController.logIn)
router.post('/logout', verifyAccessToken, SessionController.logOut)

export default router
