import { param } from 'express-validator'
import handleValidation from '../middlewares/handleValidation'

const validateId = [
  param('id').isUUID(4).withMessage('ID is not a valid UUID v4.'),
  handleValidation,
]

const validatePostId = [
  param('postId') // específico para as rotas onde há :postId
    .isUUID(4)
    .withMessage('ID is not a valid UUID v4.'),
  handleValidation,
]

const validateSlug = [
  param('slug').isSlug().withMessage('Slug is not in a valid format.'),
  handleValidation,
]

export { validateId, validatePostId, validateSlug }
