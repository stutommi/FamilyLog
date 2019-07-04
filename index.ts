import http from 'http'
import app from './app'
import config from './utils/config'
import { alertEventWithEmail } from './alertEventWithEmail'

alertEventWithEmail()

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
