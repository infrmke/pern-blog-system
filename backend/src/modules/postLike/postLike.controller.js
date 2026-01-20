import PostLikeService from './postLike.service.js'

class PostLikeController {
  async toggle(req, res, next) {
    const { id: userId } = req.user
    const { postId } = req.params

    try {
      const like = await PostLikeService.toggle(postId, userId)

      if (!like) {
        return res.status(200).json({ message: 'Post disliked.' })
      }

      return res.status(201).json({ message: 'Post liked.' })
    } catch (error) {
      next(error)
    }
  }
}

export default new PostLikeController()
