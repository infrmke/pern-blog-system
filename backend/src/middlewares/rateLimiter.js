import rateLimit from 'express-rate-limit'
import throwHttpError from '../utils/throwHttpError.js'

const rateLimiter = rateLimit({
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

export default rateLimiter
