import { DataTypes } from 'sequelize'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

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
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [100, 10000] },
    },
  },
  {
    tableName: 'posts',
    hooks: {
      beforeValidate: (post, options) => {
        if (post.isNewRecord) {
          const shortId = uuidv4().split('-')[0]
          post.slug = `${slugify(post.title, {
            lower: true,
            strict: true,
            locale: 'pt',
          })}-${shortId}`
        }
      },
    },
  }
)

export default Post
