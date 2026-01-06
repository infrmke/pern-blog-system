import User from './user/user.model.js'
import Post from './post/post.model.js'
import Comment from './comment/comment.model.js'

// RELAÇÕES DE USER
User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' })
User.hasMany(Comment, { as: 'comments', foreignKey: 'userId' })

// RELAÇÕES DE POST
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' })

// RELAÇÕES DE COMMENT
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' })

export { User, Post, Comment }
