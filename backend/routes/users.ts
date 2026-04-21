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

// POST /users — Sign up: upsert profile + send OTP
router.post('/', async (req: Request, res: Response) => {
  const { first_name, last_name, email, university } = req.body

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'first_name, last_name, and email are required' })
  }

  // 1. Upsert profile row first (onConflict requires unique constraint on email)
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      [{ email, first_name, last_name, university, email_verified: false }],
      { onConflict: 'email' }
    )

  if (upsertError) return res.status(500).json({ error: upsertError.message })

  // 2. Send OTP — creates Supabase Auth user if they don't exist yet
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { first_name, last_name, university },
      shouldCreateUser: true,
    },
  })

  if (otpError) return res.status(500).json({ error: otpError.message })

  res.status(200).json({ message: 'OTP sent to email' })
})

// POST /users/verify-otp — Verify OTP + mark email as verified
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, token } = req.body

  if (!email || !token) {
    return res.status(400).json({ error: 'email and token are required' })
  }

  // 1. Verify OTP with Supabase Auth
  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (verifyError) return res.status(400).json({ error: 'Invalid or expired OTP' })

  // 2. Mark profile as verified
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ email_verified: true })
    .eq('email', email)

  if (updateError) return res.status(500).json({ error: updateError.message })

  res.status(200).json({ message: 'Email verified!', user: data.user })
})

export default router