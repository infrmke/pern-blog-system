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

export default formatPostObject
