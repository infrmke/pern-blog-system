import { Op } from 'sequelize'
import formatPostObject from '../../utils/formatPostObject.js'
import { Post, User } from '../models.index.js'
import getPagination from '../../utils/getPagination.js'

class PostController {
  async create(req, res, next) {
    const { title, banner, content } = req.body
    const { id: authorId } = req.user

    if (!title || !content) {
      return res.status(400).json({
        error: 'Must provide fields "title" and "content" to proceed.',
      })
    }

    try {
      const postData = { title, content, authorId }

      // o banner só será adicionado se não for uma string vazia
      if (banner && banner.trim() !== '') {
        postData.banner = banner
      }

      const post = await Post.create(postData)

      const formattedPost = formatPostObject(post.toJSON())
      return res.status(201).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: posts } = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res
          .status(200)
          .json({ message: 'There are currently no created posts.' })
      }

      const totalPages = Math.ceil(count / limit)

      const formattedPosts = posts.map((post) =>
        formatPostObject(post.toJSON())
      )
      return res.status(200).json({
        items: formattedPosts,
        pagination: {
          totalItems: count,
          totalPages,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    const { id } = req.params

    try {
      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found.' })
      }

      const formattedPost = formatPostObject(post.toJSON())
      return res.status(200).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req, res, next) {
    const { slug } = req.params

    try {
      const post = await Post.findOne({
        where: { slug },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found.' })
      }

      const formattedPost = formatPostObject(post.toJSON())
      return res.status(200).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async getByTitle(req, res, next) {
    const { title } = req.query
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: posts } = await Post.findAndCountAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`, // o símbolo "%" representa uma busca em qualquer parte da string
          },
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res
          .status(404)
          .json({ error: 'No posts matching your search were found.' })
      }

      const totalPages = Math.ceil(count / limit)

      const formattedPosts = posts.map((post) =>
        formatPostObject(post.toJSON())
      )
      return res.status(200).json({
        items: formattedPosts,
        pagination: {
          totalItems: count,
          totalPages,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getByAuthor(req, res, next) {
    const { author } = req.query
    const { page, limit, offset } = getPagination(req.query)

    try {
      const { count, rows: posts } = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'author',
            where: { slug: author },
            attributes: ['id', 'name', 'slug', 'avatar'],
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res
          .status(404)
          .json({ error: 'No posts found for this author.' })
      }

      const totalPages = Math.ceil(count / limit)

      const formattedPosts = posts.map((post) =>
        formatPostObject(post.toJSON())
      )
      return res.status(200).json({
        items: formattedPosts,
        pagination: {
          totalItems: count,
          totalPages,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    const { id } = req.params

    const { title, banner, content } = req.body
    const updates = { title, banner, content } // apenas estes campos podem ser atualizados

    // remove as propriedades que não foram enviadas (estão "undefined")
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    )

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error:
          'Must provide at least one field, such as "title", "banner" or "content" to proceed with update.',
      })
    }

    const emptyField = Object.entries(updates).find(
      ([key, value]) => typeof value === 'string' && value.trim() === ''
    )

    if (emptyField) {
      const [key] = emptyField
      return res.status(400).json({ error: `"${key}" cannot be empty.` })
    }

    try {
      const post = await Post.findByPk(id)

      if (!post) return res.status(404).json({ error: 'Post not found.' })

      const updatedPost = await post.update(updates)

      const formattedPost = formatPostObject(updatedPost.toJSON())
      return res.status(200).json(formattedPost)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    const { id } = req.params

    try {
      const deleted = await Post.destroy({ where: { id } })

      if (!deleted) {
        return res.status(404).json({ error: 'Post not found.' })
      }

      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new PostController()
