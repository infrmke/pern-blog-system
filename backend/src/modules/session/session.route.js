import { Router } from 'express'

import SessionController from './session.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import loginValidator from './session.validator.js'
import handleValidation from '../../middlewares/handleValidation.js'

const router = Router()

router.get('/me', verifyAccessToken, SessionController.status)
router.post('/login', loginValidator, handleValidation, SessionController.logIn)
router.post('/logout', verifyAccessToken, SessionController.logOut)

export default router
