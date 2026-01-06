import { Post, Comment } from '../modules/models.index.js'
import canModify from '../utils/canModify.js'

const verifyPostOwnership = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id)

    if (!post) return res.status(404).json({ error: 'Post not found.' })

    if (!canModify(post, req.user)) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to modify this post.' })
    }

    req.post = post
    next()
  } catch (error) {
    next(error)
  }
}

const verifyCommentOwnership = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id)

    if (!comment) return res.status(404).json({ error: 'Comment not found.' })

    if (!canModify(comment, req.user)) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to modify this comment.' })
    }

    req.comment = comment
    next()
  } catch (error) {
    next(error)
  }
}

export { verifyPostOwnership, verifyCommentOwnership }
