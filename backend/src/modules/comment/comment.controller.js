import CommentService from './comment.service.js'
import { getPagination, formatPaginationResponse } from '../../utils/getPagination.js'
import throwHttpError from '../../utils/throwHttpError.js'

class CommentController {
  async create(req, res, next) {
    const { id: userId } = req.user
    const { postId } = req.params
    const { content } = req.body

    try {
      const comment = await CommentService.create({ content, postId, userId })

      return res.status(201).json(comment)
    } catch (error) {
      next(error)
    }
  }

  async getByPost(req, res, next) {
    const { postId } = req.params
    const { page, limit, offset } = getPagination(req.query)

    try {
      const data = await CommentService.getByPost(postId, { limit, offset })

      if (!data) {
        return res.status(200).json({ message: 'There are no comments under this post yet.' })
      }

      const { count, posts } = data

      return res.status(200).json({
        posts,
        pagination: formatPaginationResponse(count, page, limit),
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    const { id } = req.params
    const { content } = req.body

    try {
      const comment = await CommentService.update(id, { content })

      if (!comment) throwHttpError(404, 'Comment not found.', 'COMMENT_NOT_FOUND')

      return res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    const { id } = req.params

    try {
      const deleted = await CommentService.delete(id)

      if (!deleted) throwHttpError(404, 'Comment not found.', 'COMMENT_NOT_FOUND')

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new CommentController()
