import PostService from './post.service.js'

import { formatPostObject } from '../../utils/formatResourceObject.js'
import { getPagination, formatPaginationResponse } from '../../utils/getPagination.js'
import throwHttpError from '../../utils/throwHttpError.js'
import validateUpdatePayload from '../../utils/validateUpdatePayload.js'

class PostController {
  async create(req, res, next) {
    const { title, content } = req.body
    const { id: authorId } = req.user

    try {
      const post = await PostService.create({ title, content, authorId })

      return res.status(201).json(post)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    const { page, limit, offset } = getPagination(req.query)

    try {
      const data = await PostService.getAll(limit, offset)

      if (!data) {
        return res.status(200).json({ message: 'There are currently no created posts.' })
      }

      const { count, posts } = data

      return res.status(200).json({
        items: posts,
        pagination: formatPaginationResponse(count, page, limit),
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    const { id } = req.params

    try {
      const post = await PostService.getById(id)

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      return res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req, res, next) {
    const { slug } = req.params

    try {
      const post = await PostService.getBySlug(slug)

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
      const data = await PostService.getByTitle(title, { limit, offset })

      if (!data) {
        return res.status(200).json({ message: 'No posts matching your search were found.' })
      }

      const { count, posts } = data

      return res.status(200).json({
        items: posts,
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
      const data = await PostService.getByAuthor(author, { limit, offset })

      if (!data) {
        return res.status(200).json({ message: 'No posts found for this author.' })
      }

      const { count, posts } = data

      return res.status(200).json({
        items: posts,
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
      const post = await PostService.update(id, updates)

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      return res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async updateBanner(req, res, next) {
    const { id } = req.params

    if (!req.file) throwHttpError(400, 'No image file provided.', 'MISSING_IMAGE_FILE')

    try {
      const post = await PostService.updateBanner(id, req.file.filename)

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

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
      const deleted = await PostService.delete(id)

      if (!deleted) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new PostController()
