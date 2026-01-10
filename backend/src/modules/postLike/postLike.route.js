import { Router } from 'express'

import PostLikeController from './postLike.controller.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'
import { validatePostId } from '../../validators/identifiers.validator.js'

const router = Router()

router.post(
  '/post/:postId',
  verifyAccessToken,
  validatePostId,
  PostLikeController.toggle
)

export default router
