import path from 'node:path'
import fs from 'node:fs/promises'
import { Op } from 'sequelize'

import { Post, User } from '../index.models.js'
import { formatPostObject } from '../../utils/formatResourceObject.js'
import { getPagination, formatPaginationResponse } from '../../utils/getPagination.js'
import throwHttpError from '../../utils/throwHttpError.js'
import validateUpdatePayload from '../../utils/validateUpdatePayload.js'

class PostController {
  async create(req, res, next) {
    const { title, content } = req.body
    const { id: authorId } = req.user

    try {
      // post criado sem o campo "banner" pois o mesmo será preenchido automaticamente
      // pelo Sequelize e apenas alterado na rota de atualização de banner
      const post = await Post.create({ title, content, authorId })

      const formattedPost = formatPostObject(post.toJSON())
      return res.status(201).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: posts } = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res.status(200).json({ message: 'There are currently no created posts.' })
      }

      const formattedPosts = posts.map((post) => formatPostObject(post.toJSON()))
      return res.status(200).json({
        items: formattedPosts,
        pagination: formatPaginationResponse(count, page, limit),
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    const { id } = req.params

    try {
      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
      })

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      const formattedPost = formatPostObject(post.toJSON())
      return res.status(200).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req, res, next) {
    const { slug } = req.params

    try {
      const post = await Post.findOne({
        where: { slug },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
      })

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      const formattedPost = formatPostObject(post.toJSON())
      return res.status(200).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async getByTitle(req, res, next) {
    const { title } = req.query
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: posts } = await Post.findAndCountAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`, // o símbolo "%" representa uma busca em qualquer parte da string
          },
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res.status(200).json({ message: 'No posts matching your search were found.' })
      }

      const formattedPosts = posts.map((post) => formatPostObject(post.toJSON()))
      return res.status(200).json({
        items: formattedPosts,
        pagination: formatPaginationResponse(count, page, limit),
      })
    } catch (error) {
      next(error)
    }
  }

  async getByAuthor(req, res, next) {
    const { author } = req.query
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: posts } = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'author',
            where: { slug: author },
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res.status(200).json({ message: 'No posts found for this author.' })
      }

      const formattedPosts = posts.map((post) => formatPostObject(post.toJSON()))
      return res.status(200).json({
        items: formattedPosts,
        pagination: formatPaginationResponse(count, page, limit),
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    const { id } = req.params

    const { title, content } = req.body

    const updates = validateUpdatePayload(
      { title, content },
      'At least one field (title or content) is required for update.',
    )

    try {
      const post = await Post.findByPk(id)

      if (!post) return res.status(404).json({ error: 'Post not found.' })

      const updatedPost = await post.update(updates)

      const formattedPost = formatPostObject(updatedPost.toJSON())
      return res.status(200).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async updateBanner(req, res, next) {
    const { id } = req.params

    try {
      const post = await Post.findByPk(id)

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      if (!req.file) throwHttpError(400, 'No image file provided.', 'MISSING_IMAGE_FILE')

      // deleta a imagem antiga se ela exisitr e não for um link, para salvar espaço
      if (post.banner && !post.banner.startsWith('http')) {
        // constrói o caminho antigo do banner
        const oldFilePath = path.resolve('uploads', 'banners', post.banner)

        // apaga o arquivo de forma assíncrona, e o catch vazio é para
        // evitar erro caso o arquivo físico tenha sumido
        await fs.unlink(oldFilePath).catch(() => null)
      }

      // atualiza o nome do novo arquivo gerado pelo multer
      await post.update({ banner: req.file.filename })

      return res.status(200).json({
        message: 'Banner updated successfully.',
        banner: post.banner,
      })
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    const { id } = req.params

    try {
      const deleted = await Post.destroy({ where: { id } })

      if (!deleted) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new PostController()
