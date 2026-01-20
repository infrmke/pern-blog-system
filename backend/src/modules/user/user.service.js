import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import UserRepository from './user.repository.js'

import throwHttpError from '../../utils/throwHttpError.js'
import { generatePassword } from '../../utils/password.js'
import { formatUserObject } from '../../utils/formatResourceObject.js'
import { formatPaginationResponse } from '../../utils/getPagination.js'

// configurando __dirname pra funcionar em module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class UserService {
  async create(data) {
    const existingUser = await UserRepository.findOne({ email: data.email })

    if (existingUser) throwHttpError(409, 'This e-mail already exists.', 'USER_ALREADY_EXISTS')

    const hashedPassword = await generatePassword(data.password)

    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'user',
    })

    const formattedUser = formatUserObject(user.toJSON())

    return formattedUser
  }

  async getAll(page, limit, offset) {
    const data = await UserRepository.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })

    if (!data) return null

    const { count, users } = data

    if (users.length === 0) return null

    const formattedUsers = users.map((user) => formatUserObject(user.toJSON()))

    return {
      items: formattedUsers,
      pagination: formatPaginationResponse(count, page, limit),
    }
  }

  async getByFilter(filter, options) {
    const user = await UserRepository.findOne(filter, options)

    if (!user) return null

    const formattedUser = formatUserObject(user.toJSON())

    return { user, formattedUser }
  }

  async getById(id) {
    const user = await UserRepository.findByPk(id)

    if (!user) return null

    const formattedUser = formatUserObject(user.toJSON())

    return formattedUser
  }

  async getBySlug(slug) {
    const user = await UserRepository.findOne({ slug })

    if (!user) return null

    const formattedUser = formatUserObject(user.toJSON())

    return formattedUser
  }

  async update(id, data) {
    const user = await UserRepository.findByPk(id)

    if (!user) return null

    // verifica se o e-mail é único
    if (data.email && data.email !== user.email) {
      const emailExists = await UserRepository.findOne({ email: data.email })

      if (emailExists) throwHttpError(409, 'This email already exists.', 'USER_ALREADY_EXISTS')
    }

    // criptografia de senha
    if (data.password) {
      data.password = await generatePassword(data.password)
    }

    // remove o confirm_password antes de enviar os updates
    delete data.confirm_password

    const updatedUser = await UserRepository.update(id, data)

    if (!updatedUser) return null

    const formattedUser = formatUserObject(updatedUser.toJSON())

    return formattedUser
  }

  async updateAvatar(id, filename) {
    const user = await UserRepository.findByPk(id)

    if (!user) return null

    // deleta a imagem antiga se ela exisitr e não for um link, para salvar espaço
    if (user.avatar && !user.avatar.startsWith('http')) {
      // constrói o caminho antigo do avatar
      const oldFilePath = path.resolve(__dirname, '..', '..', 'uploads', 'avatars', user.avatar)

      // apaga o arquivo de forma assíncrona, e o catch vazio é para
      // evitar erro caso o arquivo físico tenha sumido
      await fs.unlink(oldFilePath).catch(() => null)
    }

    // atualiza o nome do novo arquivo gerado pelo multer
    const updatedUser = await UserRepository.update(id, { avatar: filename })
    if (!updatedUser) throwHttpError(400, 'User not found.', 'USER_NOT_FOUND')

    return { avatar: updatedUser.avatar }
  }

  async destroy(id) {
    const user = await UserRepository.findByPk(id)

    if (!user) return null

    // deleta o avatar do usuário se ele existir e não for um link, para salvar espaço
    if (user.avatar && !user.avatar.startsWith('http')) {
      const filePath = path.resolve(__dirname, '..', '..', 'uploads', 'avatars', user.avatar)
      await fs.unlink(filePath).catch(() => null)
    }

    return await UserRepository.remove(id)
  }
}

export default new UserService()
