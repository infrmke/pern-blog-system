/**
 * Extrai e valida parâmetros de paginação de `req.query`.
 * Garante o valor mínimo de 1 e calcula o offset.
 * @param {Object} query - O objeto `req.query` da requisição.
 * @returns {Object} Dados de paginação processados.
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.max(1, parseInt(query.limit) || 10)
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Gera metadados de paginação para a resposta da API.
 * @param {number} count - Total de itens encontrados no banco de dados.
 * @param {number} page - Página atual.
 * @param {number} limit - Limite de itens por página.
 * @returns {Object} Objeto com totais e ponteiros para páginas adjacentes.
 */
const formatPaginationResponse = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit)

  return {
    totalItems: count,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  }
}

export { getPagination, formatPaginationResponse }
