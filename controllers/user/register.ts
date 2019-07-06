// Libraries
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
// Models
import User from '../../models/user'
// Utils
import { transporter } from '../../utils/mailConfig'
import config from '../../utils/config'

interface IRegisterArgs {
  email: string,
  username: string,
  password: string,
}

const registerRouter = express.Router()

registerRouter.post('/', async (req, res, next) => {
  const { email, username, password }: IRegisterArgs = req.body

  try {
    const saltRounds: number = 10

    if (!password) {
      return res.status(400).json({ error: 'Blank fields' })
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      email,
      passwordHash,
      username
    })

    const savedUser = await newUser.save()

    jwt.sign({
      id: savedUser._id
    },
      config.EMAIL_SECRET,
      (_: any, emailToken: string) => {
        console.log(emailToken)
        const url = `${config.clientUrl}/api/register/confirmation/${emailToken}`

        transporter.sendMail({
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
          subject: 'Confirm Email',
          to: email
        })

      })

    res.status(201).send('Register succesful')

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
  return res.redirect(`${config.clientUrl}`)
})

export default registerRouter
