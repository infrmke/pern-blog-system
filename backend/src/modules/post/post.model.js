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
    defaultValue: 'https://placehold.co/600x400/png',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

export default Post
