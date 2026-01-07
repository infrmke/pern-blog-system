import { Router } from 'express'

import PostLikeController from './postLike.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

router.post('/post/:postId', verifyAccessToken, PostLikeController.toggle)

export default router
