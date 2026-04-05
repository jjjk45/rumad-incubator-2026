import { Router, Request, Response } from 'express'
import supabase from '../lib/supabase'

const router = Router()

// GET all profiles
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST - Sign up + send OTP
router.post('/', async (req: Request, res: Response) => {
  const { first_name, last_name, email, university } = req.body

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { first_name, last_name, university },
      shouldCreateUser: true
    }
  })

  if (error) return res.status(500).json({ error: error.message })

  await supabase.from('profiles').upsert([{
    email, first_name, last_name, university, email_verified: false
  }])

  res.status(200).json({ message: 'OTP sent to email' })
})

// POST - Verify OTP
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, token } = req.body

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })

  if (error) return res.status(400).json({ error: 'Invalid or expired OTP' })

  await supabase
    .from('profiles')
    .update({ email_verified: true })
    .eq('email', email)

  res.status(200).json({ message: 'Email verified!', user: data.user })
})

// export always at the bottom
export default router