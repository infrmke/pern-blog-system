import { Post, PostLike } from '../models.index.js'

class PostLikeController {
  async toggle(req, res, next) {
    const { id: userId } = req.user
    const { postId } = req.params

    try {
      const post = await Post.findByPk(postId)

      if (!post) return res.status(404).json({ error: 'Post not found.' })

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
