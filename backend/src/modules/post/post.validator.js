import { body } from 'express-validator'
import handleValidation from '../../middlewares/handleValidation.js'

const basePostRules = [
  body('title')
    .trim()
    .isString()
    .withMessage('Title must be a string.')
    .isLength({ min: 8, max: 144 })
    .withMessage('Title must be between 8 and 144 characters.')
    .notEmpty()
    .withMessage('Title cannot be empty.'),

  body('content')
    .trim()
    .isString()
    .withMessage('Content must be a string.')
    .isLength({ min: 100, max: 10000 })
    .withMessage('Content must be between 100 and 10000 characters.')
    .notEmpty()
    .withMessage('Content cannot be empty.'),
]

const createPostValidator = [...basePostRules, handleValidation]

const updatePostValidator = [
  ...basePostRules.map((rule) => rule.optional()), // transforma todos os campos em opcionais
  handleValidation,
]

export { createPostValidator, updatePostValidator }
