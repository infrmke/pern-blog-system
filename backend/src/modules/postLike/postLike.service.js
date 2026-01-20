import PostService from '../post/post.service.js'
import PostLikeRepository from './postLike.repository.js'

class PostLikeService {
  async toggle(postId, userId) {
    const post = await PostService.getById(postId)

    if (!post) throwHttpError(404, 'Post not found.', 'POST_NOT_FOUND')

    const existingLike = await PostLikeRepository.findOne({ userId, postId })

    // caso o usuário já tenha dado "like", remove esse mesmo like
    if (existingLike) {
      await PostLikeRepository.remove(existingLike.id)
      return false
    }

    // caso o usuário não tenha dado like, "cria" um like
    await PostLikeRepository.create({ userId, postId })
    return true
  }
}

export default new PostLikeService()
