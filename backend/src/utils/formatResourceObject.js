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

const formatPostObject = (post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  banner: post.banner,
  content: post.content,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  likesCount: post.likedBy ? post.likedBy.length : 0,
  author: post.author
    ? {
        id: post.author.id,
        name: post.author.name,
        slug: post.author.slug,
        avatar: post.author.avatar,
      }
    : null,
})

const formatCommentObject = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  user: comment.user
    ? {
        id: comment.user.id,
        name: comment.user.name,
        slug: comment.user.slug,
      }
    : null,
  post: comment.post
    ? {
        id: comment.post.id,
        title: comment.post.title,
        slug: comment.post.slug,
      }
    : null,
})

export { formatUserObject, formatPostObject, formatCommentObject }
