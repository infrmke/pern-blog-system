const HTTP_ERROR = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict', // indica "conflito" no estado atual de um recurso no servidor (ex.: duplicidade)
  500: 'Internal Server Error',
}

/**  Captura qualquer erro inesperado lançado em rotas, middlewares ou controllers.
 * Diferencia entre ambiente de produção e desenvolvimento.
 */
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500
  let code = err.code || 'INTERNAL_SERVER_ERROR'
  let message =
    err.message || 'An unexpected error occurred. Try again another time.'

  // tratamento GENÉRICO para erro de duplicidade
  // pode ser personalizado no catch(error) do controller
  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409
    code = 'RESOURCE_ALREADY_EXISTS'
    message =
      'One or more of the records provided already exist in the database.'
  }

  // tratamento GENÉRICO para erro de referência (foreign key não existe)
  // pode ser personalizado no catch(error) do controller
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400
    code = 'FOREIGN_KEY_CONFLICT'
    message = 'The referenced resource does not exist.'
  }

  //  busca o nome do erro ou simplesmente usa 'Error'
  const errorType = HTTP_ERROR[status] || 'Error'

  //  log de erro
  if (process.env.NODE_ENV === 'development') {
    console.error(`\n${err.name} - ${err.message}`)
    console.error(err.stack)
  }

  return res.status(status).json({
    status,
    error: errorType,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : null),
  })
}

export default errorHandler
