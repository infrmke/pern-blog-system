import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { Op } from 'sequelize'

import PostRepository from './post.repository.js'
import User from '../user/user.model.js'
import { formatPostObject } from '../../utils/formatResourceObject.js'

// configurando __dirname pra funcionar em module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// associação User como "author" para reutilização
const includeAuthor = {
  model: User,
  as: 'author',
  attributes: ['id', 'name', 'slug', 'avatar'],
}

class PostService {
  async create(data) {
    // o post é criado sem o campo "banner" pois o mesmo será preenchido automaticamente e apenas alterado na rota de atualização de banner
    const post = await PostRepository.create(data)

    const formattedPost = formatPostObject(post.toJSON())

    return formattedPost
  }

  async getAll(pagination) {
    const { count, rows: posts } = await PostRepository.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      include: [includeAuthor],
    })

    if (posts.length === 0) return null

    const formattedPosts = posts.map((post) => formatPostObject(post.toJSON()))

    return {
      count,
      posts: formattedPosts,
    }
  }

  async getById(id) {
    const post = await PostRepository.findByPk(id)

    if (!post) return null

    const formattedPost = formatPostObject(post)

    return formattedPost
  }

  async getBySlug(slug) {
    const post = await PostRepository.findOne(
      { slug },
      {
        include: [includeAuthor, { model: User, as: 'likedBy', attributes: ['id'] }],
      },
    )

    if (!post) return null

    const formattedPost = formatPostObject(post)

    return formattedPost
  }

  async getByTitle(title, pagination) {
    const { count, rows: posts } = await PostRepository.findAndCountAll({
      where: { title: { [Op.iLike]: `%${title}%` } }, // o símbolo "%" representa uma busca em qualquer parte da string
      limit: pagination.limit,
      offset: pagination.offset,
      include: [includeAuthor],
    })

    if (posts.length === 0) return null

    const formattedPosts = posts.map((post) => formatPostObject(post.toJSON()))

    return {
      count,
      posts: formattedPosts,
    }
  }

  async getByAuthor(author, pagination) {
    const { count, rows: posts } = await PostRepository.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      include: [
        {
          ...includeAuthor,
          where: { slug: author }, // aplicando o filtro direto na associação
        },
      ],
    })

    if (posts.length === 0) return null

    const formattedPosts = posts.map((post) => formatPostObject(post.toJSON()))

    return {
      count,
      posts: formattedPosts,
    }
  }

  async update(id, data) {
    const post = await PostRepository.update(id, data)

    if (!post) return null

    const formattedPost = formatPostObject(post.toJSON())

    return formattedPost
  }

  async updateBanner(id, filename) {
    const post = await PostRepository.findByPk(id)

    if (!post) return null

    // deleta a imagem antiga se ela exisitr e não for um link, para salvar espaço
    if (post.banner && !post.banner.startsWith('http')) {
      // constrói o caminho antigo do banner
      const oldFilePath = path.resolve(__dirname, '..', '..', 'uploads', 'banners', post.banner)

      // apaga o arquivo de forma assíncrona, e o catch vazio é para
      // evitar erro caso o arquivo físico tenha sumido
      await fs.unlink(oldFilePath).catch(() => null)
    }

    // atualiza o nome do novo arquivo gerado pelo multer
    const updatedPost = await PostRepository.update(id, { banner: filename })

    if (!updatedPost) throwHttpError(400, 'Post not found.', 'POST_NOT_FOUND')

    return { banner: updatedPost.banner }
  }

  async delete(id) {
    const post = await PostRepository.findByPk(id)

    if (!post) return null

    // deleta o banner do post se ele existir e não for um link, para salvar espaço
    if (post.banner && !post.banner.startsWith('http')) {
      const filePath = path.resolve(__dirname, '..', '..', 'uploads', 'banners', post.banner)
      await fs.unlink(filePath).catch(() => null)
    }

    return await PostRepository.remove(id)
  }
}

export default new PostService()
