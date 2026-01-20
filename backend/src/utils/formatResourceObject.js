/**
 * Filtra e formata os dados do objeto `user`.
 * @param {Object} user - Instância ou objeto bruto do usuário.
 * @returns {Object} Dados públicos e formatados do usuário.
 */
const formatUserObject = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  slug: user.slug,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

/**
 * Filtra e formata os dados e relacionamentos do objeto `post`.
 * @param {Object} post - Instância ou objeto bruto da publicação.
 * @returns {Object} Publicação estruturada.
 */
const formatPostObject = (post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  banner: post.banner,
  content: post.content,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,

  // só adiciona likesCount se houver ao menos 1 like
  ...(post.likedBy?.length > 0 && { likesCount: post.likedBy.length }),

  // só adiciona a propriedade author se ela existir
  ...(post.author && {
    author: {
      id: post.author.id,
      name: post.author.name,
      slug: post.author.slug,
    },
  }),
})

/**
 * Filtra e formata os dados e relacionamentos do objeto `comment`.
 * @param {Object} comment - Instância ou objeto bruto do comentário.
 * @returns {Object} Comentário estruturado.
 */
const formatCommentObject = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,

  // só adiciona a propriedade user se ela existir
  ...(comment.user && {
    user: {
      id: comment.user.id,
      name: comment.user.name,
      slug: comment.user.slug,
    },
  }),

  // só adiciona a propriedade post se ela existir
  ...(comment.post && {
    post: {
      id: comment.post.id,
      title: comment.post.title,
      slug: comment.post.slug,
    },
  }),
})

export { formatUserObject, formatPostObject, formatCommentObject }
