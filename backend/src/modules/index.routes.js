import { Router } from 'express'

import rateLimiter from '../middlewares/rateLimiter.js'

import UserRouter from './user/user.route.js'
import SessionRouter from './session/session.route.js'
import PostRouter from './post/post.route.js'
import CommentRouter from './comment/comment.route.js'
import PostLikeRouter from './postLike/postLike.route.js'

const router = Router()

router.use(rateLimiter)

router.use('/users', UserRouter)
router.use('/sessions', SessionRouter)
router.use('/posts', PostRouter)
router.use('/comments', CommentRouter)
router.use('/likes', PostLikeRouter)

export default router
