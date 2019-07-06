// Libraries
import bodyParser from 'body-parser'
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import config from './utils/config'
import logger from './utils/logger'
import middleware from './utils/middleware'
// Routes
import personRouter from './controllers/person'
import userRouter from './controllers/user/user'

const app = express()
app.use(express.static('build'))

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => logger.info('connected to database'))
  .catch(error => logger.error('error connecting to database', error.message)
  )

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(middleware.tokenExtractor as any)

app.use('/api/user', userRouter)
app.use('/api/person', personRouter)

app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, './build/index.html'));
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler as any)

export default app
