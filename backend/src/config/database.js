import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    logging: false,
  }
)

const connectToDb = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    console.log('[SEQUELIZE] Database connected and synchronized.')
  } catch (error) {
    console.error('\n[SEQUELIZE] Connection error:', error)
  }
}

export { sequelize, connectToDb }
