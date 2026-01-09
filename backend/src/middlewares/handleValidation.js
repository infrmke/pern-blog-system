import { validationResult } from 'express-validator'
import throwHttpError from '../utils/throwHttpError.js'

const handleValidation = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg // pega apenas a primeira mensagem de erro
    throwHttpError(400, firstError, 'VALIDATION_ERROR')
  }

  next()
}

export default handleValidation
