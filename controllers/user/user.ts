// Libraries
import express from 'express'
// Routers
import loginRouter from './login'
import registerRouter from './register'
import deleteRouter from './delete'
import editRouter from './edit'

const userRouter = express.Router()

userRouter.use('/edit', editRouter)
userRouter.use('/register', registerRouter)
userRouter.use('/login', loginRouter)
userRouter.use('/delete', deleteRouter)

export default userRouter
