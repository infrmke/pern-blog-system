import { Post } from '../index.models.js'

class PostRepository {
  async create(data) {
    const post = await Post.create(data)
    return post
  }

  async findAndCountAll(options = {}) {
    const posts = await Post.findAndCountAll({
      distinct: true,
      order: [['createdAt', 'DESC']],
      ...options,
    })

    return posts
  }

  async findOne(filter, options = {}) {
    const post = await Post.findOne({ where: filter, ...options })
    return post
  }

  async findByPk(id) {
    const post = await Post.findByPk(id)
    return post
  }

  async update(id, data) {
    const post = await Post.findByPk(id)
    return post ? await post.update(data) : null
  }

  async remove(id) {
    const post = await Post.destroy({ where: { id } })
    return post
  }
}

export default new PostRepository()
