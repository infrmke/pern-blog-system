import { body } from 'express-validator'
import handleValidation from '../../middlewares/handleValidation.js'

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .isLength({ min: 2, max: 56 })
    .withMessage('Name must be between 2 and 56 characters.'),

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
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match each other.')
      }
      return true
    }),

  handleValidation,
]

const updateValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .isLength({ min: 2, max: 54 })
    .withMessage('Name must be between 2 and 56 characters.'),

  body('email')
    .optional()
    .trim()
    .normalizeEmail() // retira pontos extras e converte a string para minúscula
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('Provide a valid e-mail address.'),

  body('avatar')
    .optional()
    .trim()
    .isString()
    .withMessage('Avatar must be a string.')
    .notEmpty()
    .withMessage('Avatar cannot be empty.'),

  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),

  body('confirm_password')
    .if(body('password').exists()) // apenas valida se "password" for enviado
    .notEmpty()
    .withMessage('Confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match each other.')
      }
      return true
    }),

  handleValidation,
]

export { registerValidator, updateValidator }
