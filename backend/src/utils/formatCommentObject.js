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

export default formatCommentObject
