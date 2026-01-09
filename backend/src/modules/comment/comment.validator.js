import { body } from 'express-validator'

const commentValidator = [
  body('content')
    .isString()
    .withMessage('Comment must be a string.')
    .notEmpty()
    .withMessage('Comment cannot be empty.')
    .isLength({ min: 1, max: 150 })
    .withMessage('Comment must be between 1 and 150 characters.'),
]

export default commentValidator
