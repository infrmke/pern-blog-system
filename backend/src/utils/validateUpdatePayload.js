import throwHttpError from './throwHttpError.js'

/**
 * Limpa chaves undefined de um objeto e valida se ele não está vazio.
 * @param {Object} updates - O objeto com os campos para atualizar.
 * @param {string} message - Mensagem personalizada de erro caso esteja vazio.
 * @returns {Object} - O objeto limpo.
 */
const validateUpdatePayload = (updates, message) => {
  // remove as propriedades que não foram enviadas (estão "undefined")
  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key])

  // verifica se restou algo no objeto
  if (Object.keys(updates).length === 0) {
    throwHttpError(400, message, 'EMPTY_UPDATE_PAYLOAD')
  }

  return updates
}

export default validateUpdatePayload
