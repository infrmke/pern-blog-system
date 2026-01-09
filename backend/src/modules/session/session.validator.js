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

const loginValidator = [
  body('email')
    .trim()
    .normalizeEmail() // retira pontos extras e converte a string para minúscula
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('Provide a valid e-mail address.'),

  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .withMessage('Password must be at least 8 characters.'),

  validate,
]

export default loginValidator
