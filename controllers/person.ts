// Libraries
import * as express from 'express'
import jwt from 'jsonwebtoken'
import Person from '../models/person'
import User from '../models/user'

const personRouter = express.Router()

personRouter.get('/', async (req: any, res, next) => {
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

    const user: any = await User
      .findById(decodedToken.id)
      .populate('persons')

    res.status(200).json(user.persons)

  } catch (error) {
    next(error)
  }
})

personRouter.put('/:id', async (req: any, res, next) => {
  const body = req.body
  console.log('body', body)
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

    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, body, { new: true })

    res.status(200).json(updatedPerson)

  } catch (error) {
    next(error)
  }
})

personRouter.post('/new', async (req: any, res, next) => {
  const body = req.body

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

    const newPerson = new Person({
      ...body,
      user: decodedToken.id
    })

    const savedPerson = await newPerson.save()

    await User.findByIdAndUpdate(
      decodedToken.id,
      { $push: { persons: savedPerson.id } },
      { new: true })

    res
      .status(201)
      .send({ newPerson })

  } catch (exception) {
    next(exception)
  }
})

export default personRouter
