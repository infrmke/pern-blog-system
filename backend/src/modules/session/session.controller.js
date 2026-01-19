import SessionService from './session.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

class SessionController {
  async status(req, res, next) {
    const { id } = req.user

    try {
      const user = await SessionService.status(id)

      if (!user) throwHttpError(404, 'User or session not found.', 'USER_NOT_FOUND')

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async logIn(req, res, next) {
    const { email, password } = req.body

    try {
      const data = await SessionService.authenticate({ email, password })

      if (!data) throwHttpError(400, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')

      const { accessToken, formattedUser: user } = data

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      })

      return res.status(200).json(user)
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
