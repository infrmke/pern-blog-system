import verifyAccessToken from './verifyAccessToken.js'
import {
  validateId,
  validatePostId,
} from '../validators/identifiers.validator.js'
import isAdmin from './isAdmin.js'
import {
  verifyUserOwnership,
  verifyPostOwnership,
  verifyCommentOwnership,
} from './verifyOwnership.js'

/**
 * Verifica se o usuário está logado e se o ID (`id`) passado é válido.
 */
const protectedIdResource = [verifyAccessToken, validateId]

/**
 * Verifica se o usuário está logado e se o ID (`postId`) passado é válido.
 */
const protectedPostResource = [verifyAccessToken, validatePostId]

/**
 * Verifica se o usuário está logado e se possui o papel (`role`) de administrador.
 */
const adminAccess = [verifyAccessToken, isAdmin]

/**
 * Verifica se o usuário que está logado e se o ID (`id`) passado é válido.
 * Também verifica se o usuário é dono do `user` que deseja alterar.
 */
const userAccountControl = [...protectedIdResource, verifyUserOwnership]

/**
 * Verifica se o usuário está logado e se o ID (`id`) passado é válido.
 * Também verifica se o usuário é administrador e se é dono do `post` que deseja alterar.
 */
const postControl = [...protectedIdResource, isAdmin, verifyPostOwnership]

/**
 * Verifica se o usuário está logado e se o ID (`id`) passado é válido.
 * Também verifica se o usuário é dono do `comment` que deseja alterar.
 */
const commentControl = [...protectedIdResource, verifyCommentOwnership]

export {
  protectedIdResource,
  protectedPostResource,
  adminAccess,
  userAccountControl,
  postControl,
  commentControl,
}
