import rateLimit from 'express-rate-limit'
import throwHttpError from '../utils/throwHttpError.js'

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // apenas 200 requisições por janela
  handler: (req, res, next) => {
    try {
      throwHttpError(
        429,
        'You are sending too many requests. Please try again later.',
        'TOO_MANY_REQUESTS'
      )
    } catch (error) {
      next(error)
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // apenas 10 requisições por janela, para evitar brute force
  handler: (req, res, next) => {
    try {
      throwHttpError(
        429,
        'You are sending too many requests. Please try again later.',
        'TOO_MANY_REQUESTS'
      )
    } catch (error) {
      next(error)
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const contentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // apenas 20, para evitar spam
  handler: (req, res, next) => {
    try {
      throwHttpError(
        429,
        'You are sending too many requests. Please try again later.',
        'TOO_MANY_REQUESTS'
      )
    } catch (error) {
      next(error)
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export { globalLimiter, sessionLimiter, contentLimiter }
