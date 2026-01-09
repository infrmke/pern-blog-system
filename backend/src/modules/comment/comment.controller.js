import { Comment, Post, User } from '../models.index.js'
import { formatCommentObject } from '../../utils/formatResourceObject.js'
import {
  getPagination,
  formatPaginationResponse,
} from '../../utils/getPagination.js'

class CommentController {
  async create(req, res, next) {
    const { id: userId } = req.user
    const { postId } = req.params
    const { content } = req.body

    try {
      const comment = await Comment.create({ content, postId, userId })

      const formattedComment = formatCommentObject(comment.toJSON())
      return res.status(201).json(formattedComment)
    } catch (error) {
      next(error)
    }
  }

  async getByPost(req, res, next) {
    const { postId } = req.params
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: comments } = await Comment.findAndCountAll({
        where: { postId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'title', 'slug'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (comments.length === 0) {
        return res
          .status(200)
          .json({ message: 'There are no comments under this post yet.' })
      }

      const formattedComments = comments.map((comment) =>
        formatCommentObject(comment.toJSON())
      )
      return res.status(200).json({
        items: formattedComments,
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
      const comment = await Comment.findByPk(id, {
        include: [
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'title', 'slug'],
          },
        ],
      })

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' })
      }

      const updatedComment = await comment.update({ content })

      const formattedComment = formatCommentObject(updatedComment.toJSON())
      return res.status(200).json(formattedComment)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    const { id } = req.params

    try {
      const deleted = await Comment.destroy({ where: { id } })

      if (!deleted) {
        return res.status(404).json({ error: 'Comment not found.' })
      }

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new CommentController()
