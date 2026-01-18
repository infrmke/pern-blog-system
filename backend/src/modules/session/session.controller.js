import { User } from '../index.models.js'

import generateToken from '../../utils/generateToken.js'
import { formatUserObject } from '../../utils/formatResourceObject.js'
import { validatePassword } from '../../utils/password.js'
import throwHttpError from '../../utils/throwHttpError.js'

class SessionController {
  async status(req, res, next) {
    const { id } = req.user

    try {
      const user = await User.findByPk(id)

      if (!user) throwHttpError(404, 'User or session not found.', 'USER_NOT_FOUND')

      const formattedUser = formatUserObject(user.toJSON())
      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async logIn(req, res, next) {
    const { email, password } = req.body

    try {
      const user = await User.findOne({
        where: { email },
        attributes: { include: ['password'] },
        raw: true,
      })

      if (!user) throwHttpError(401, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')

      const isPwdValid = await validatePassword(password, user.password)

      if (!isPwdValid) throwHttpError(401, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')

      const accessToken = generateToken(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        '1d',
      )

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      })

      const formattedUser = formatUserObject(user)
      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  async logOut(req, res, next) {
    try {
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
      })

      return res.status(200).json({ message: 'User has logged out.' })
    } catch (error) {
      next(error)
    }
  }
}

export default new SessionController()
