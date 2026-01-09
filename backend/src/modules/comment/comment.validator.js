import { validationResult, body } from 'express-validator'
import throwHttpError from '../../utils/throwHttpError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg // pega apenas a primeira mensagem de erro
    throwHttpError(400, firstError, 'VALIDATION_ERROR')
  }

  next()
}

const commentValidator = [
  body('content')
    .isString()
    .withMessage('Comment must be a string.')
    .notEmpty()
    .withMessage('Comment cannot be empty.')
    .isLength({ min: 1, max: 150 })
    .withMessage('Comment must be between 1 and 150 characters.'),

  validate,
]

export default commentValidator
