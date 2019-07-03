import nodemailer from 'nodemailer'
import config from './config'

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS,
  }
})
