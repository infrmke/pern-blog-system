import bcrypt from 'bcrypt'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import { User } from '../models.index.js'
import formatUserObject from '../../utils/formatUserObject.js'

class UserController {
  async create(req, res, next) {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        error:
          'Must provide fields "name", "email" and "password" to register.',
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

      const shortId = uuidv4().split('-')[0]
      const slug = `${slugify(name, { lower: true })}-${shortId}`

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        slug,
        role: role || 'user',
      })

      const formattedUser = formatUserObject(user.toJSON())
      return res.status(201).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
      })

      if (users.length === 0) {
        return res
          .status(200)
          .json({ message: 'There are currently no registered users.' })
      }

      const formattedUsers = users.map((user) =>
        formatUserObject(user.toJSON())
      )
      return res.status(200).json(formattedUsers)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    const { id } = req.params

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      })

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
        attributes: { exclude: ['password'] },
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
    const updates = req.body

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error:
          'Must provide at least one field, such as "name", "email" or "password", to proceed with update.',
      })
    }

    const emptyField = Object.entries(updates).find(
      ([key, value]) => typeof value === 'string' && value.trim() === ''
    )

    if (emptyField) {
      const [key] = emptyField
      return res.status(400).json({ error: `"${key}" cannot be empty.` })
    }

    try {
      const user = await User.findByPk(id)

      if (!user) return res.status(404).json({ error: 'User not found.' })

      if (updates.name) {
        const shortId = uuidv4().split('-')[0]
        updates.slug = `${slugify(updates.name, { lower: true })}-${shortId}`
      }

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
