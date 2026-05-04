import { Router, Request, Response } from 'express'
import supabase from '../lib/supabase'

const router = Router()
const VALID_EMAIL_DOMAIN = '@scarletmail.rutgers.edu'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isScarletMailEmail(email: string): boolean {
  return normalizeEmail(email).endsWith(VALID_EMAIL_DOMAIN)
}

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
  const requestEmail = typeof email === 'string' ? email : String(email ?? '')
  const normalizedEmail = normalizeEmail(requestEmail)

  console.log('[POST /users] incoming request', {
    email: normalizedEmail,
    hasFirstName: Boolean(first_name),
    hasLastName: Boolean(last_name),
    university,
  })

  if (!first_name || !last_name || !email) {
    console.log('[POST /users] validation failed: missing required fields')
    return res.status(400).json({ error: 'first_name, last_name, and email are required' })
  }

  if (!isScarletMailEmail(normalizedEmail)) {
    console.log('[POST /users] validation failed: invalid domain', { email: normalizedEmail })
    return res.status(400).json({ error: 'A Rutgers ScarletMail email is required' })
  }

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      data: { first_name, last_name, university },
      shouldCreateUser: true,
    },
  })

  if (otpError) {
    console.log('[POST /users] otp send failed', {
      email: normalizedEmail,
      error: otpError.message,
    })
    return res.status(500).json({ error: otpError.message })
  }

  console.log('[POST /users] otp sent successfully', { email: normalizedEmail })

  // Best-effort profile upsert. Some schemas require `id` and may reject
  // pre-verification inserts; do not block OTP delivery on this.
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      [{ email: normalizedEmail, first_name, last_name, university, email_verified: false }],
      { onConflict: 'email' }
    )

  if (upsertError) {
    console.log('[POST /users] profile upsert failed (non-blocking)', {
      email: normalizedEmail,
      error: upsertError.message,
    })
  } else {
    console.log('[POST /users] profile upsert succeeded', { email: normalizedEmail })
  }

  console.log('[POST /users] response', { status: 200, message: 'OTP sent to email' })

  res.status(200).json({ message: 'OTP sent to email' })
})

// Legacy endpoint: prefer client-side supabase.auth.verifyOtp + POST /users/verify-email.
// POST /users/verify-otp — Verify OTP + mark email as verified
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, token } = req.body

  if (!email || !token) {
    return res.status(400).json({ error: 'email and token are required' })
  }

  const normalizedEmail = normalizeEmail(email)

  if (!isScarletMailEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'A Rutgers ScarletMail email is required' })
  }

  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token,
    type: 'email',
  })

  if (verifyError) return res.status(400).json({ error: 'Invalid or expired OTP' })

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ email_verified: true })
    .eq('email', normalizedEmail)

  if (updateError) return res.status(500).json({ error: updateError.message })

  res.status(200).json({ message: 'Email verified!', user: data.user })
})

router.post('/verify-email', async (req: Request, res: Response) => {
  const { email } = req.body
  const authHeader = req.headers.authorization
  const accessToken =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null

  if (!email || !accessToken) {
    return res.status(400).json({ error: 'email and bearer token are required' })
  }

  const normalizedEmail = normalizeEmail(email)

  if (!isScarletMailEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'A Rutgers ScarletMail email is required' })
  }
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken)

  if (userError || !user?.email) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }

  if (normalizeEmail(user.email) !== normalizedEmail) {
    return res.status(403).json({ error: 'Session email does not match request email' })
  }

  const firstName = typeof user.user_metadata?.first_name === 'string'
    ? user.user_metadata.first_name
    : null
  const lastName = typeof user.user_metadata?.last_name === 'string'
    ? user.user_metadata.last_name
    : null
  const university = typeof user.user_metadata?.university === 'string'
    ? user.user_metadata.university
    : null

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      [{
        id: user.id,
        email: normalizedEmail,
        first_name: firstName,
        last_name: lastName,
        university,
        email_verified: true,
      }],
      { onConflict: 'email' }
    )

  if (upsertError) return res.status(500).json({ error: upsertError.message })

  res.status(200).json({ message: 'Email verified!' })
})

export default router
