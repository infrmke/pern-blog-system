import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database.cjs'

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [1, 150] },
    },
  },
  { tableName: 'comments' }
)

export default Comment
