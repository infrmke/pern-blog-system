import express from 'express'
import cookieParser from 'cookie-parser'

import { connectToDb } from './config/database.js'
import globalRouter from './modules/index.routes.js'
import errorHandler from './middlewares/errorHandler.js'
import verifyUploadFolders from './utils/verifyUploadFolders.js'

// config
const app = express()

verifyUploadFolders() // verifica se a pasta "uploads" com "avatars" e "banners" existe

app.use(express.json())
app.use(cookieParser())

connectToDb()

// rotas
app.use(globalRouter)

// middleware para rotas não encontradas (404)
app.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found.`)
  error.status = 404
  error.code = 'ROUTE_NOT_FOUND'
  next(error)
})

// middleware global de erro
app.use(errorHandler)

export default app
