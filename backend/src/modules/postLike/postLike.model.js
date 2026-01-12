import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.cjs'

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
      unique: 'unique_user_post_like', // um usuário só pode dar um único like em cada post
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'unique_user_post_like', // um usuário só pode dar um único like em cada post
    },
  },
  { tableName: 'postLikes' }
)

export default PostLike
