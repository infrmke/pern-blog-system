import { Post } from '../modules/models.index.js'

const verifyOwnership = async (req, res, next) => {
  const { id } = req.params // id do post vindo da URL
  const userId = req.user.id // id do usuário vindo do JWT

  try {
    const post = await Post.findByPk(id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' })
    }

    // verifica se o autor do post e o usuário logado são o mesmo
    if (post.authorId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to modify this resource.',
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default verifyOwnership
