import { PostLike } from '../index.models.js'

class PostLikeRepository {
  async create(data) {
    return await PostLike.create(data)
  }

  async findOne(filter) {
    return await PostLike.findOne({ where: filter })
  }

  async remove(id) {
    return await PostLike.destroy({ where: { id } })
  }
}

export default new PostLikeRepository()
