import http from 'http'
import app from './app'
import config from './utils/config'
import { alertEventWithEmail } from './alertEventWithEmail'
import User from './models/user'
import Person from './models/person'

const doThis = async () => {
  const users = await User.find({})
  users.forEach(user => {
    user.allowEmailNotifications = true
    user.save()
  })
}

const doThat = async () => {
  const persons = await Person.find({})
  persons.forEach(person => {
    const previous = person.birth
    person.birth = {
      // @ts-ignore
      date: new Date(previous),
      // @ts-ignore
      notifyByEmail: person.birth.notifyByEmail = true
    }
    person.save()
    console.log('person', person)
  })
}

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
