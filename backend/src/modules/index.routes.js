import { Router } from 'express'

import {
  globalLimiter,
  sessionLimiter,
  contentLimiter,
} from '../middlewares/rateLimiter.js'

import UserRouter from './user/user.route.js'
import SessionRouter from './session/session.route.js'
import PostRouter from './post/post.route.js'
import CommentRouter from './comment/comment.route.js'
import PostLikeRouter from './postLike/postLike.route.js'

const router = Router()

router.use(globalLimiter)

router.use('/users', UserRouter)
router.use('/sessions', sessionLimiter, SessionRouter)
router.use('/posts', contentLimiter, PostRouter)
router.use('/comments', contentLimiter, CommentRouter)
router.use('/likes', PostLikeRouter)

export default router
