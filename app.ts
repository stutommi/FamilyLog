import config from './utils/config'
import middleware from './utils/middleware'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import express from 'express'
const app = express()
import mongoose from 'mongoose'
import logger from './utils/logger'
// Routes
import loginRouter from './controllers/login'
import registerRouter from './controllers/register'
import personRouter from './controllers/person'

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => logger.info('connected to database'))
  .catch(error => logger.error('error connecting to database', error.message)
  )

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(middleware.tokenExtractor as any)

app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)
app.use('/api/person', personRouter)

// For testing purposes
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler as any)

export default app