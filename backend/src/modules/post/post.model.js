import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [8, 144] },
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
      validate: { len: [100, 10000] },
    },
  },
  { tableName: 'posts' }
)

export default Post
