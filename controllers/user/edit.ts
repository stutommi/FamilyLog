// Libraries
import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../../models/user'

const editRouter = express.Router()

editRouter.put('/email-notifications', async (req: any, res, next) => {

  try {
    // @ts-ignore
    if (!req.token) {
      const error = new Error('Token missing')
      error.name = 'JsonWebTokenError'
      return next(error)
    }

    const decodedToken: any = jwt.verify(req.token, process.env.SECRET as any)

    if (!decodedToken.id) {
      const error = new Error('Token invalid')
      error.name = 'JsonWebTokenError'
      return next(error)
    }

    const user: any = await User.findById(decodedToken.id)
    const currentNotificationStatus = user.allowEmailNotifications

    user.allowEmailNotifications = !currentNotificationStatus

    user.save()

    res.status(200).send({ allowEmailNotifications: !currentNotificationStatus })

  } catch (error) {
    next(error)
  }
})

export default editRouter
