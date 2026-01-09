import User from './user/user.model.js'
import Post from './post/post.model.js'
import Comment from './comment/comment.model.js'
import PostLike from './postLike/postLike.model.js'

// RELAÇÕES DE USER
User.hasMany(Post, { as: 'posts', foreignKey: 'authorId', onDelete: 'CASCADE' })
User.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
})
User.belongsToMany(Post, {
  through: PostLike,
  as: 'likedPosts',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
})

// RELAÇÕES DE POST
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })
Post.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'postId',
  onDelete: 'CASCADE',
})
Post.belongsToMany(User, {
  through: PostLike,
  as: 'likedBy',
  foreignKey: 'postId',
  onDelete: 'CASCADE',
})

// RELAÇÕES DE COMMENT
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' })

// RELAÇÕES DE POSTLIKE
PostLike.belongsTo(User, { as: 'user', foreignKey: 'userId' })
PostLike.belongsTo(Post, { as: 'post', foreignKey: 'postId' })

export { User, Post, Comment, PostLike }
