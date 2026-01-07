import formatCommentObject from '../../utils/formatCommentObject.js'
import { Comment, Post, User } from '../models.index.js'

class CommentController {
  async create(req, res) {
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

      const formattedComment = formatCommentObject(comment)
      return res.status(201).json(formattedComment)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getByPost(req, res) {
    const { postId } = req.params

    try {
      const comments = await Comment.findAll({
        where: { postId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'username', 'slug', 'avatar'],
          },
          {
            model: Post,
            as: 'post',
            attributes: ['id', 'title', 'slug'],
          },
        ],
        order: [['createdAt', 'DESC']],
      })

      if (comments.length === 0) {
        return res
          .status(200)
          .json({ message: 'There are no comments under this post yet.' })
      }

      const formattedComments = comments.map((comment) =>
        formatCommentObject(comment)
      )
      return res.status(200).json(formattedComments)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async update(req, res) {
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

      const formattedComment = formatCommentObject(updatedComment)
      return res.status(200).json(formattedComment)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      const deleted = await Comment.destroy({ where: { id } })

      if (!deleted) {
        return res.status(404).json({ error: 'Comment not found.' })
      }

      return res.status(204).end()
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export default new CommentController()
