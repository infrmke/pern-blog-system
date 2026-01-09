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

const basePostRules = [
  body('title')
    .trim()
    .isString()
    .withMessage('Title must be a string.')
    .isLength({ min: 8, max: 144 })
    .withMessage('Title must be between 8 and 144 characters.')
    .notEmpty()
    .withMessage('Title cannot be empty.'),

  body('banner')
    .trim()
    .isString()
    .withMessage('Banner must be a string.')
    .notEmpty()
    .withMessage('Banner cannot be empty.'),

  body('content')
    .trim()
    .isString()
    .withMessage('Content must be a string.')
    .isLength({ min: 100, max: 10000 })
    .withMessage('Content must be between 100 and 10000 characters.')
    .notEmpty()
    .withMessage('Content cannot be empty.'),
]

const createPostValidator = [
  body('banner').optional(), // torna "banner" opcional
  ...basePostRules,
  validate,
]

const updatePostValidator = [
  ...basePostRules.map((rule) => rule.optional()), // transforma todos os campos em opcionais
  validate,
]

export { createPostValidator, updatePostValidator }
