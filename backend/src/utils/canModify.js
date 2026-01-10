/**
 * Compara o proprietário de um recurso com o usuário logado para autorização.
 * @param {Object} resource - O objeto do banco de dados.
 * @param {Object} user - O usuário autenticado vindo de `req.user`.
 * @returns {boolean} True se o usuário for o dono do recurso.
 */
const canModify = (resource, user) => {
  const ownerId = resource.authorId || resource.userId
  return ownerId?.toString() === user.id.toString()
}

export default canModify
