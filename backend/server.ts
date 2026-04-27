import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import usersRouter from './routes/users'
import emailHookRouter from './routes/emailHook'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', usersRouter)
app.use('/auth/send-email', express.text({ type: '*/*' }), emailHookRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})