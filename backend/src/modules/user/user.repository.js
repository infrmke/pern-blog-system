import User from './user.model.js'

class UserRepository {
  async create(data) {
    const user = await User.create(data)
    return user
  }

  async findOne(filter, options = {}) {
    const user = await User.findOne({ where: filter, ...options })
    return user
  }

  async findAndCountAll(limit, offset, order) {
    const { count, rows: users } = await User.findAndCountAll(limit, offset, order)
    return { count, users }
  }

  async findByPk(id) {
    const user = await User.findByPk(id)
    return user
  }

  async update(id, data) {
    const user = await User.findByPk(id)
    return user ? await user.update(data) : null
  }

  async remove(filter) {
    const user = await User.destroy({ where: filter })
    return user
  }
}

export default new UserRepository()
