let clientUrl = ''

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  clientUrl = 'http://localhost:3000'
}


let GMAIL_USER = process.env.GMAIL_USER
let GMAIL_PASS = process.env.GMAIL_PASS
let PORT = process.env.PORT
let EMAIL_SECRET = process.env.EMAIL_SECRET as string
let mongoUrl: string = process.env.MONGODB_URI as string


if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI as string
}

export default {
  PORT,
  mongoUrl,
  clientUrl,
  EMAIL_SECRET,
  GMAIL_PASS,
  GMAIL_USER,
}