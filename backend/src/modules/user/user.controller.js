import bcrypt from 'bcrypt'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import formatUserObject from '../../utils/formatUserObject.js'
import User from './user.model.js'

class UserController {
  async create(req, res) {
    const { name, username, email, password, role } = req.body

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        error:
          'Must provide fields "name", "username", "email", "password" to register.',
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
        username,
        email,
        password: hashedPassword,
        slug,
        role: role || 'user',
      })

      const formattedUser = formatUserObject(user.get({ plain: true }))
      return res.status(201).json(formattedUser)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        raw: true,
      })

      if (!users) {
        return res
          .status(200)
          .json({ message: 'There are currently no registered users.' })
      }

      const formattedUsers = users.map((user) => formatUserObject(user))
      return res.status(200).json(formattedUsers)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getById(req, res) {
    const { id } = req.params

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        raw: true,
      })

      if (!user) return res.status(404).json({ error: 'User not found.' })

      const formattedUser = formatUserObject(user)
      return res.status(200).json(formattedUser)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getBySlug(req, res) {
    const { slug } = req.params

    try {
      const user = await User.findOne({
        where: { slug },
        attributes: { exclude: ['password'] },
        raw: true,
      })

      if (!user) return res.status(404).json({ error: 'User not found.' })

      const formattedUser = formatUserObject(user)
      return res.status(200).json(formattedUser)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async update(req, res, next) {
    const { id } = req.params
    const updates = req.body

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error:
          'Must provide at least one field, as "name", "email", "username" or "password", to proceed with update.',
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

      if (updates.username && updates.username !== user.username) {
        const usernameExists = await User.findOne({
          where: { username: updates.username },
        })

        if (usernameExists)
          return res
            .status(409)
            .json({ error: 'This username already exists in the database.' })
      }

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10)
      }

      const updatedUser = await user.update(updates)

      const formattedUser = formatUserObject(updatedUser)
      return res.status(200).json(formattedUser)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      const deleted = await User.destroy({ where: { id } })

      if (!deleted) return res.status(404).json({ error: 'User not found.' })

      return res.status(204).end()
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export default new UserController()
