import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'
import { Op } from 'sequelize'

import formatPostObject from '../../utils/formatPostObject.js'

import { Post, User } from '../models.index.js'

class PostController {
  async create(req, res) {
    const { title, banner, content } = req.body
    const { id: authorId } = req.user

    if (!title || !content) {
      return res.status(400).json({
        error: 'Must provide fields "title" and "content" to proceed.',
      })
    }

    try {
      const shortId = uuidv4().split('-')[0]
      const slug = `${slugify(title, {
        lower: true,
        strict: true,
        locale: 'pt',
      })}-${shortId}`

      const post = await Post.create({ title, slug, banner, content, authorId })
      return res.status(201).json(post)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getAll(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'username', 'slug', 'avatar'],
          },
        ],
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        res
          .status(200)
          .json({ message: 'There are currently no created posts.' })
      }

      const formattedPosts = posts.map((post) => formatPostObject(post))
      return res.status(200).json(formattedPosts)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getById(req, res) {
    const { id } = req.params

    try {
      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'username', 'slug', 'avatar'],
          },
        ],
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found.' })
      }

      const formattedPost = formatPostObject(post)
      return res.status(200).json(formattedPost)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getBySlug(req, res) {
    const { slug } = req.params

    try {
      const post = await Post.findOne({
        where: { slug },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'username', 'slug', 'avatar'],
          },
        ],
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found.' })
      }

      const formattedPost = formatPostObject(post)
      return res.status(200).json(formattedPost)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getByTitle(req, res) {
    const { title } = req.query

    try {
      const posts = await Post.findAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`, // o símbolo "%" representa uma busca em qualquer parte da string
          },
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'username', 'slug', 'avatar'],
          },
        ],
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res
          .status(404)
          .json({ error: 'No posts matching your search were found.' })
      }

      const formattedPosts = posts.map((post) => formatPostObject(post))
      return res.status(200).json(formattedPosts)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async getByAuthor(req, res) {
    const { author } = req.query

    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'author',
            where: { slug: author },
            attributes: ['id', 'name', 'username', 'slug', 'avatar'],
          },
        ],
        order: [['createdAt', 'DESC']],
      })

      if (posts.length === 0) {
        return res
          .status(404)
          .json({ error: 'No posts found for this author.' })
      }

      const formattedPosts = posts.map((post) => formatPostObject(post))
      return res.status(200).json(formattedPosts)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async update(req, res) {
    const { id } = req.params
    const updates = req.body

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error:
          'Must provide at least one field, as "title", "banner" or "content" to proceed with update.',
      })
    }

    const emptyField = Object.entries(updates).find(
      ([key, value]) => typeof value === 'string' && value.trim() === ''
    )

    if (emptyField) {
      const [key] = emptyField
      return res.status(400).json({ error: `"${key}" cannot be empty.` })
    }

    if (updates.slug) {
      return res.status(400).json({ error: "Cannot change a post's slug." })
    }

    try {
      const post = await Post.findByPk(id)

      if (!post) return res.status(404).json({ error: 'Post not found.' })

      const updatedPost = await post.update(updates)

      const formattedPost = formatPostObject(updatedPost)
      return res.status(200).json(formattedPost)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      const deleted = await Post.destroy({ where: { id } })

      if (!deleted) {
        return res.status(404).json({ error: 'Post not found.' })
      }

      res.status(204).end()
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export default new PostController()
