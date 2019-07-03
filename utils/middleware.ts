import logger from './logger';
import { Request, Response, NextFunction } from 'express';

interface IError {
  status: number,
  message: string,
  name: string
}

interface IReqWithToken extends Request {
  token: string
}

const tokenExtractor = (request: IReqWithToken, response: Response, next: NextFunction) => {

  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    request.token = token
  }
  next()
}

const unknownEndpoint = (_: void, response: any) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: IError, _: void, response: Response, next: NextFunction) => {
  logger.error(error.message)
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    error.message.includes('Blank')
    ? response.status(400).json({ error: 'Blank fields' })
    : response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'AuthenticationError') {
    return response.status(401).json(error.message)
  }

  next(error)
}

export default {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}
