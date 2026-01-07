import express from 'express'
import cookieParser from 'cookie-parser'

import { connectToDb } from './config/database.js'

import UserRouter from './modules/user/user.route.js'
import AuthRouter from './modules/auth/auth.route.js'
import PostRouter from './modules/post/post.route.js'
import CommentRouter from './modules/comment/comment.route.js'

import errorHandler from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cookieParser())

connectToDb()

app.use('/users', UserRouter)
app.use('/auth', AuthRouter)
app.use('/posts', PostRouter)
app.use('/comments', CommentRouter)

app.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found.`)
  error.status = 404
  error.code = 'ROUTE_NOT_FOUND'
  next(error)
})

app.use(errorHandler)

app.listen(PORT, () =>
  console.log(`[SERVER] up and running at http://localhost:${PORT}`)
)
