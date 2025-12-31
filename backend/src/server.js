import express from 'express'

import { connectToDb } from './config/database.js'

import UserRouter from './modules/user/user.route.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

connectToDb()

app.use('/users', UserRouter)

app.listen(PORT, () =>
  console.log(`[SERVER] up and running at http://localhost:${PORT}`)
)
