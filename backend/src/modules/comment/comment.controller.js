import formatCommentObject from '../../utils/formatCommentObject.js'
import { Comment, Post, User } from '../models.index.js'

class CommentController {
  async create(req, res, next) {
    const { id: userId } = req.user
    const { postId } = req.params
    const { content } = req.body

    if (!content) {
      return res
        .status(400)
        .json({ error: 'Must provide field "content" to proceed.' })
    }

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

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

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

      const totalPages = Math.ceil(count / limit)

      const formattedComments = comments.map((comment) =>
        formatCommentObject(comment.toJSON())
      )
      return res.status(200).json({
        items: formattedComments,
        pagination: {
          totalItems: count,
          totalPages,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    const { id } = req.params
    const { content } = req.body

    if (!content) {
      return res
        .status(400)
        .json({ error: 'Must provide field "content" to proceed.' })
    }

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
