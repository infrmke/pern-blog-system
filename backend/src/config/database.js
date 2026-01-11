import { Sequelize } from 'sequelize'

// para o sequelize-cli
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  logging: false,
}

// para o aplicativo
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
    console.log('[SEQUELIZE] Database connected and synchronized.')
    sequelize.sync({ alter: true })
  } catch (error) {
    console.error('\n[SEQUELIZE] Connection error:', error)
  }
}

// exportação do objeto config puro para o .sequelizerc
module.exports = config

// exportações nomeadas para o resto da aplicação
module.exports.sequelize = sequelize
module.exports.connectToDb = connectToDb
