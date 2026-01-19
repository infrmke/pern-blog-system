import UserService from './user.service.js'

import { getPagination } from '../../utils/getPagination.js'
import throwHttpError from '../../utils/throwHttpError.js'
import validateUpdatePayload from '../../utils/validateUpdatePayload.js'

class UserController {
  async create(req, res, next) {
    const { name, email, password, role } = req.body

    try {
      const user = await UserService.create({ name, email, password, role })
      return res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    const { page, limit, offset } = getPagination(req.query)

    try {
      const data = await UserService.getAll(page, limit, offset)

      if (!data) {
        return res.status(200).json({ message: 'There are currently no registered users.' })
      }

      const { items, pagination } = data

      return res.status(200).json({
        items,
        pagination,
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    const { id } = req.params

    try {
      const user = await UserService.getById(id)

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req, res, next) {
    const { slug } = req.params

    try {
      const user = await UserService.getBySlug(slug)

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    const { id } = req.params
    const { name, email, password, confirm_password } = req.body

    const updates = validateUpdatePayload(
      { name, email, password, confirm_password },
      'At least one field (name, email, or password) is required for an update.',
    )

    try {
      const user = await UserService.update(id, updates)

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateAvatar(req, res, next) {
    const { id } = req.params

    if (!req.file) throwHttpError(400, 'No image file provided.', 'MISSING_IMAGE_FILE')

    try {
      const user = await UserService.updateAvatar(id, req.file.filename)

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      return res.status(200).json({
        message: 'Avatar updated successfully.',
        avatar: user.avatar,
      })
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    const { id } = req.params

    try {
      const deleted = await UserService.destroy(id)

      if (!deleted) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
