import http from 'http'
import app from './app'
import config from './utils/config'
import { alertEventWithEmail } from './alertEventWithEmail'

// Checks birthdays and special dates of persons
// and sends notification if date is 7 days away from now
alertEventWithEmail()
setInterval(() => {
  alertEventWithEmail()
}, 1000 * 60 * 60 * 24)

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
