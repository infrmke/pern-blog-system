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
  },
  { tableName: 'postLikes' }
)

export default PostLike
