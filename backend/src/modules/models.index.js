import User from './user/user.model.js'
import Post from './post/post.model.js'

// RELAÇÕES DE USER
User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' })

// RELAÇÕES DE POST
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })

export { User, Post }
