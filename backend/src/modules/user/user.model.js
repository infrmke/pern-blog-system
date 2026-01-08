import { DataTypes } from 'sequelize'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import { sequelize } from '../../config/database.js'

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 54] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    hooks: {
      beforeValidate: (user, options) => {
        if (user.isNewRecord || user.changed('name')) {
          const shortId = uuidv4().split('-')[0]
          user.slug = `${slugify(user.name, { lower: true })}-${shortId}`
        }

        if (user.isNewRecord && !user.avatar) {
          const firstName = user.name.split(' ')[0]
          const encodedFirstName = encodeURIComponent(firstName)
          user.avatar = `https://ui-avatars.com/api/?name=${encodedFirstName}&background=random`
        }
      },
    },
  }
)

export default User
