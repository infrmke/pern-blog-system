import { Op } from 'sequelize'
import bcrypt from 'bcrypt'

import generateToken from '../../utils/generateToken.js'
import formatUserObject from '../../utils/formatUserObject.js'

import User from '../user/user.model.js'

class SessionController {
  async status(req, res, next) {
    try {
      return res.status(200).json(req.user)
    } catch (error) {
      next(error)
    }
  }

  async logIn(req, res, next) {
    const { login, password } = req.body

    if (!login || !password) {
      return res.status(400).json({
        error:
          'Must provide "login" (email or username) and "password" to proceed.',
      })
    }

    try {
      const user = await User.findOne({
        where: {
          //  email = login OU username = login
          [Op.or]: [{ email: login }, { username: login }],
        },
        attributes: { include: ['password'] },
        raw: true,
      })

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' })
      }

      const isPwdValid = await bcrypt.compare(password, user.password)

      if (!isPwdValid) {
        return res.status(401).json({ error: 'Invalid credentials.' })
      }

      const accessToken = generateToken(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        '1d'
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
