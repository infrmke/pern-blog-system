import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

User.hasMany(Post, { foreignKey: 'authorId' })
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })

export default Post
