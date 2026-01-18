import { Post, PostLike } from '../index.models.js'
import throwHttpError from '../../utils/throwHttpError.js'

class PostLikeController {
  async toggle(req, res, next) {
    const { id: userId } = req.user
    const { postId } = req.params

    try {
      const post = await Post.findByPk(postId)

      if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

      const existingLike = await PostLike.findOne({
        where: { userId, postId },
      })

      // caso o usuário já tenha dado "like", remove esse mesmo like
      if (existingLike) {
        await existingLike.destroy()
        return res.status(200).json({ message: 'Post disliked.' })
      }

      // caso o usuário não tenha dado like, "cria" um like
      await PostLike.create({ userId, postId })
      return res.status(201).json({ message: 'Post liked.' })
    } catch (error) {
      next(error)
    }
  }
}

export default new PostLikeController()
