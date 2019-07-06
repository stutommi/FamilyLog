// Libraries
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../../models/user'

const loginRouter = express.Router()

loginRouter.post('/', async (req, res, next) => {
  const body = req.body
  try {

    const user: any = await User.findOne({ email: body.email })

    const passwordCorrect = user === null || body.password === undefined
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    if (!passwordCorrect) {
      const error = new Error('Invalid email or password')
      error.name = 'AuthenticationError'
      return next(error)
    }

    if (!user.confirmed) {
      const error = new Error('Please confirm your email to login')
      error.name = 'AuthenticationError'
      return next(error)
    }
    
    const userForToken = {
      id: user._id,
      username: body.username
    }

    const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret)

    res
      .status(200)
      .send({
        token,
        username: user.username,
        allowEmailNotifications: user.allowEmailNotifications
      })

  } catch (exception) {
    next(exception)
  }
})

export default loginRouter
