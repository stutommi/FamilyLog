// Libraries
import * as express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Person from '../models/person'
import User from '../models/user'

const personRouter = express.Router()

personRouter.post('/new', async (req: any, res, next) => {
  const { userId, ...body } = req.body
  try {
    // @ts-ignore
    if (!req.token) {
      const error = new Error('Token missing or invalid')
      error.name = 'JsonWebTokenError'
      return next(error)
    }


    const decodedToken: any = jwt.verify(req.token, process.env.SECRET as any)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const newPerson = new Person({
      ...body,
      user: userId
    })

    const savedPerson = await newPerson.save()

    const user: any = await User.findByIdAndUpdate(
      userId,
      { $push: { "persons": savedPerson.id } },
      { new: true })

    res
      .status(201)
      .send({ newPerson })



  } catch (exception) {
    next(exception)
  }
})

export default personRouter