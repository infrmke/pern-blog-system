import { Router } from 'express'

import PostLikeController from './postLike.controller.js'
import { protectedPostResource } from '../../middlewares/tollPlaza.js'

const router = Router()

//  --- ROTAS PROTEGIDAS ---

// @route POST /likes/post/:postId
router.post('/post/:postId', protectedPostResource, PostLikeController.toggle)

export default router
