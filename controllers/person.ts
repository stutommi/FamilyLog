// Libraries
import * as express from 'express'
import jwt from 'jsonwebtoken'
import Person from '../models/person'
import User from '../models/user'

const personRouter = express.Router()

// Decodes token and attaches it to request object
personRouter.use((req: any, res, next) => {
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

  req.decodedTokenId = decodedToken.id
  next()
})

personRouter.get('/', async (req: any, res, next) => {
  try {
    const user: any = await User
      .findById(req.decodedTokenId)
      .populate('persons')

    res.status(200).json(user.persons)

  } catch (error) {
    next(error)
  }
})

personRouter.put('/:id', async (req: any, res, next) => {
  const body = req.body
  try {
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, body, { new: true })

    res.status(200).json(updatedPerson)

  } catch (error) {
    next(error)
  }
})

personRouter.post('/new', async (req: any, res, next) => {
  const body = req.body
  try {
    const newPerson = new Person({
      ...body,
      user: req.decodedTokenId
    })

    const savedPerson = await newPerson.save()

    await User.findByIdAndUpdate(
      req.decodedTokenId,
      { $push: { persons: savedPerson.id } },
      { new: true })

    res
      .status(201)
      .send({ newPerson })

  } catch (exception) {
    next(exception)
  }
})

personRouter.delete('/:id', async (req: any, res, next) => {
  try {
    await User
      .updateOne(
        { _id: req.decodedTokenId },
        { $pull: { persons: { $in: [req.params.id] } } }
      )

    await Person.findByIdAndRemove(req.params.id)

    res
      .status(200)
      .send(req.params.id)

  } catch (exception) {
    next(exception)
  }
})

export default personRouter
