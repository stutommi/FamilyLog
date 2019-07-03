let clientUrl = 'https://familylog.herokuapp.com'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  clientUrl = 'http://localhost:3000'
}

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS
const PORT = process.env.PORT
const EMAIL_SECRET = process.env.EMAIL_SECRET as string
let mongoUrl: string = process.env.MONGODB_URI as string
console.log('mongoUrl IN CONFIG', mongoUrl)
if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI as string
}

export default {
  clientUrl,
  EMAIL_SECRET,
  GMAIL_PASS,
  GMAIL_USER,
  mongoUrl,
  PORT
}
