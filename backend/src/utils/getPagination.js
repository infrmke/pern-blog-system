const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.max(1, parseInt(query.limit) || 10)
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

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
