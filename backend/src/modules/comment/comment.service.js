import CommentRepository from './comment.repository.js'
import PostService from '../post/post.service.js'

import User from '../user/user.model.js'
import Post from '../post/post.model.js'

import { formatCommentObject } from '../../utils/formatResourceObject.js'

// associação Post para reutilização
const includePost = {
  model: Post,
  as: 'post',
  attributes: ['id', 'title', 'slug'],
}

class CommentService {
  async create(data) {
    const comment = await CommentRepository.create(data)

    const formattedComment = formatCommentObject(comment.toJSON())

    return formattedComment
  }

  async getByPost(postId, pagination) {
    const post = await PostService.getById(postId)

    if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

    const { count, rows: comments } = await CommentRepository.findAndCountAll(
      { postId },
      {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          includePost,
        ],
        limit: pagination.limit,
        offset: pagination.offset,
      },
    )

    if (comments.length === 0) return null

    const formattedComments = comments.map((comment) => formatCommentObject(comment.toJSON()))

    return {
      count,
      posts: formattedComments,
    }
  }

  async update(id, data) {
    const comment = await CommentRepository.update(id, data, {
      include: [includePost],
    })

    if (!comment) return null

    const formattedComment = formatCommentObject(comment.toJSON())

    return formattedComment
  }

  async delete(id) {
    const deleted = await CommentRepository.remove(id)

    if (!deleted) return null

    return deleted
  }
}

export default new CommentService()
