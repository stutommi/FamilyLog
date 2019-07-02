// Libraries
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
// Models
import User from '../models/user'
// Utils
import { transporter } from '../utils/mailConfig'
import config from '../utils/config'

interface RegisterArgs {
  email: string,
  username: string,
  password: string,
}

const registerRouter = express.Router()

registerRouter.post('/', async (req, res, next) => {
  const { email, username, password }: RegisterArgs = req.body

  try {
    const saltRounds: number = 10

    if (!password) {
      return res.status(400).json({ error: 'Blank fields' })
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      email,
      username,
      passwordHash
    })

    const savedUser = await newUser.save()

    console.log(savedUser)
    console.log(config.EMAIL_SECRET as jwt.Secret)
    jwt.sign({
      id: savedUser._id
    },
      config.EMAIL_SECRET,
      (_: any, emailToken: string) => {
        console.log(emailToken)
        const url = `http://localhost:3003/api/register/confirmation/${emailToken}`

        transporter.sendMail({
          to: email,
          subject: 'Confirm Email',
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        })

      })

    res.json(savedUser)

  } catch (exception) {
    next(exception)
  }
})

registerRouter.get('/confirmation/:token', async (req, res, next) => {

  try {
    const decodedToken: any = jwt.verify(req.params.token, config.EMAIL_SECRET as string)

    await User.findByIdAndUpdate(decodedToken.id, { confirmed: true })
  } catch (exception) {
    next(exception)
  }

  return res.redirect(`${config.clientUrl}/login`)
});

export default registerRouter