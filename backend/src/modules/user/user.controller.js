import path from 'node:path'
import fs from 'node:fs'

import { User } from '../index.models.js'
import { formatUserObject } from '../../utils/formatResourceObject.js'
import { getPagination, formatPaginationResponse } from '../../utils/getPagination.js'
import { generatePassword } from '../../utils/password.js'
import throwHttpError from '../../utils/throwHttpError.js'
import validateUpdatePayload from '../../utils/validateUpdatePayload.js'

class UserController {
  async create(req, res, next) {
    const { name, email, password, role } = req.body

    try {
      const existingUser = await User.findOne({ where: { email } })

      if (existingUser) throwHttpError(409, 'This e-mail already exists.', 'USER_ALREADY_EXISTS')

      const hashedPassword = await generatePassword(password)

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
        return res.status(200).json({ message: 'There are currently no registered users.' })
      }

      const formattedUsers = users.map((user) => formatUserObject(user.toJSON()))

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

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

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

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      const formattedUser = formatUserObject(user.toJSON())
      return res.status(200).json(formattedUser)
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
      const user = await User.findByPk(id)

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      if (updates.email && updates.email !== user.email) {
        const emailExists = await User.findOne({
          where: { email: updates.email },
        })

        if (emailExists) throwHttpError(409, 'This email already exists.', 'USER_ALREADY_EXISTS')
      }

      if (updates.password) {
        updates.password = await generatePassword(updates.password)
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

  async updateAvatar(req, res, next) {
    const { id } = req.params

    try {
      const user = await User.findByPk(id)

      if (!user) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      if (!req.file) throwHttpError(400, 'No image file provided.', 'MISSING_IMAGE_FILE')

      // deleta a imagem antiga se ela exisitr e não for um link, para salvar espaço
      if (user.avatar && !user.avatar.startsWith('http')) {
        // constrói o caminho antigo do avatar
        const oldFilePath = path.resolve('uploads', 'avatars', user.avatar)

        // apaga o arquivo de forma assíncrona, e o catch vazio é para
        // evitar erro caso o arquivo físico tenha sumido
        await fs.unlink(oldFilePath).catch(() => null)
      }

      // atualiza o nome do novo arquivo gerado pelo multer
      await user.update({ avatar: req.file.filename })

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
      const deleted = await User.destroy({ where: { id } })

      if (!deleted) throwHttpError(404, 'User not found.', 'USER_NOT_FOUND')

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
