import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'

const PostLike = sequelize.define(
  'PostLike',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'unique_user_post_like',
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'unique_user_post_like',
    },
  },
  { tableName: 'postLikes' }
)

export default PostLike
