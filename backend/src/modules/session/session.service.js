import UserService from '../user/user.service.js'

import throwHttpError from '../../utils/throwHttpError.js'
import { validatePassword } from '../../utils/password.js'
import generateToken from '../../utils/generateToken.js'

class SessionService {
  async status(id) {
    const user = await UserService.getById(id)

    if (!user) return null

    return user
  }

  async authenticate(credentials) {
    const data = await UserService.getByFilter(
      { email: credentials.email },
      {
        attributes: { include: ['password'] },
      },
    )

    if (!data) throwHttpError(401, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')

    const { user, formattedUser } = data

    const isPwdValid = await validatePassword(credentials.password, user.password)

    if (!isPwdValid) throwHttpError(401, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')

    const accessToken = generateToken(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      '1d',
    )

    return { accessToken, formattedUser }
  }
}

export default new SessionService()
