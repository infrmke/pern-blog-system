import { body } from 'express-validator'
import handleValidation from '../../middlewares/handleValidation.js'

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('Provide a valid e-mail address.')
    .normalizeEmail(), // retira pontos extras e converte a string para minúscula

  body('password').notEmpty().withMessage('Password cannot be empty.'),
  handleValidation,
]

export default loginValidator
