import bcrypt from 'bcrypt'

import { User } from '../models.index.js'
import { formatUserObject } from '../../utils/formatResourceObject.js'
import {
  getPagination,
  formatPaginationResponse,
} from '../../utils/getPagination.js'
import verifyEmptyFields from '../../utils/verifyEmptyFields.js'

class UserController {
  async create(req, res, next) {
    const { name, email, password, confirm_password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        error:
          'Must provide fields "name", "email", "password" and "confirm_password" to register.',
      })
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        error: "Passwords don't match each other.",
      })
    }

    try {
      const existingUser = await User.findOne({ where: { email } })

      if (existingUser) {
        return res
          .status(409)
          .json({ error: 'This email already exists in the database.' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      })

      const formattedUser = formatUserObject(user.toJSON())
      return res.status(201).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: users } = await User.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (users.length === 0) {
        return res
          .status(200)
          .json({ message: 'There are currently no registered users.' })
      }

      const formattedUsers = users.map((user) =>
        formatUserObject(user.toJSON())
      )

      return res.status(200).json({
        items: formattedUsers,
        pagination: formatPaginationResponse(count, page, limit),
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    const { id } = req.params

    try {
      const user = await User.findByPk(id)

      if (!user) return res.status(404).json({ error: 'User not found.' })

      const formattedUser = formatUserObject(user.toJSON())
      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req, res, next) {
    const { slug } = req.params

    try {
      const user = await User.findOne({
        where: { slug },
      })

      if (!user) return res.status(404).json({ error: 'User not found.' })

      const formattedUser = formatUserObject(user.toJSON())
      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    const { id } = req.params

    const { name, email, avatar, password, confirm_password } = req.body
    const updates = { name, email, avatar, password, confirm_password } // apenas estes campos podem ser atualizados

    // remove as propriedades que não foram enviadas (estão "undefined")
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    )

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error:
          'Must provide at least one field, such as "name", "email" or "password" with "confirm_password", to proceed with update.',
      })
    }

    const emptyField = verifyEmptyFields(updates)

    if (emptyField) {
      return res.status(404).json({ error: `${emptyField} cannot be empty.` })
    }

    if (updates.password && updates.password !== updates.confirm_password) {
      return res.status(400).json({
        error: "Passwords don't match each other.",
      })
    }

    try {
      const user = await User.findByPk(id)

      if (!user) return res.status(404).json({ error: 'User not found.' })

      if (updates.email && updates.email !== user.email) {
        const emailExists = await User.findOne({
          where: { email: updates.email },
        })

        if (emailExists)
          return res
            .status(409)
            .json({ error: 'This email already exists in the database.' })
      }

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10)
      }

      // remove o confirm_password antes de enviar os updates
      delete updates.confirm_password

      const updatedUser = await user.update(updates)

      const formattedUser = formatUserObject(updatedUser.toJSON())
      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    const { id } = req.params

    try {
      const deleted = await User.destroy({ where: { id } })

      if (!deleted) return res.status(404).json({ error: 'User not found.' })

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
