import Comment from './comment.model.js'

class CommentRepository {
  async create(data) {
    const comment = await Comment.create(data)
    return comment
  }

  async findAndCountAll(filter, options = {}) {
    const comments = await Comment.findAndCountAll({
      where: filter,
      distinct: true,
      order: [['createdAt', 'DESC']],
      ...options,
    })

    return comments
  }

  async update(id, data, options = {}) {
    const comment = await Comment.findByPk(id, { ...options })
    return comment ? comment.update(data) : null
  }

  async remove(id) {
    const deleted = await Comment.destroy({ where: { id } })
    return deleted
  }
}

export default new CommentRepository()
